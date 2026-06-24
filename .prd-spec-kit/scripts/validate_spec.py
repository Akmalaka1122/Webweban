#!/usr/bin/env python3
"""
validate_spec.py — Validate prd-spec-kit artifacts.

Catches the most common bug class in spec-driven development:
"I claimed 83 FRs in the summary, but the spec actually has 55."

Usage:
    python3 scripts/validate_spec.py [<feature-dir>]

Default feature dir: /home/ubuntu/.prd-spec-kit/features/001-feature-name/
Override by passing the path as the first argument.

Exit codes:
    0 — no errors (warnings are OK)
    1 — errors found (fix before handoff)

Checks performed:
    1. FR/SC/NFR/US/Task ID numbering (sequential vs gaps)
    2. Task format compliance (strict Spec Kit regex)
    3. Story labels (present in US phases, absent in Setup/Foundational/Polish)
    4. Cross-artifact FR coverage (spec FRs referenced in plan/tasks)
    5. Constitution alignment (if constitution.md exists)
    6. Terminology consistency (Cashier/kasir, etc.)
    7. Markdown structure sanity (H1/H2/H3 counts)
    8. Clarifications integration (no orphan [NEEDS CLARIFICATION] markers)
"""

import re
import sys
import pathlib
from collections import Counter, defaultdict


def find_feature_dir(arg: str | None) -> pathlib.Path:
    """Locate the feature directory from CLI arg or default."""
    if arg:
        path = pathlib.Path(arg)
        if not path.exists():
            print(f"❌ Feature dir not found: {path}", file=sys.stderr)
            sys.exit(2)
        return path

    # Default: first feature dir under /home/ubuntu/.prd-spec-kit/features/
    base = pathlib.Path("/home/ubuntu/.prd-spec-kit/features")
    if not base.exists():
        print(f"❌ Spec base dir not found: {base}", file=sys.stderr)
        print("   Pass the feature dir as first arg.", file=sys.stderr)
        sys.exit(2)

    features = sorted(base.iterdir()) if base.is_dir() else []
    if not features:
        print(f"❌ No features found in {base}", file=sys.stderr)
        sys.exit(2)

    return features[0]


def load_files(feature_dir: pathlib.Path) -> dict[str, str]:
    """Load all expected artifacts. Missing files are reported as warnings."""
    files = {
        "constitution": feature_dir.parent.parent / "constitution.md",
        "spec": feature_dir / "spec.md",
        "plan": feature_dir / "plan.md",
        "tasks": feature_dir / "tasks.md",
        "analyze": feature_dir / "analyze.md",
        "checklist": feature_dir / "checklists" / "quality.md",
    }
    loaded = {}
    for name, path in files.items():
        if path.exists():
            loaded[name] = path.read_text()
        else:
            loaded[name] = None  # Missing, will warn
    return loaded


def check_numbering(files: dict, errors: list, warnings: list) -> None:
    """Check FR/SC/NFR/US/Task ID numbering."""
    spec = files.get("spec") or ""
    tasks = files.get("tasks") or ""

    def check_id_set(ids: list[int], label: str, allow_gaps: bool = False):
        if not ids:
            warnings.append(f"{label}: no IDs found")
            return
        unique = sorted(set(ids))
        expected = set(range(unique[0], unique[-1] + 1))
        missing = sorted(expected - set(unique))
        duplicates = [n for n, c in Counter(ids).items() if c > 1]
        if duplicates:
            errors.append(f"{label}: duplicate IDs in references: {duplicates}")
        if missing and not allow_gaps:
            errors.append(f"{label}: not sequential, missing: {missing[:10]}")
        elif missing:
            warnings.append(f"{label}: intentional gaps detected: {missing[:10]} (verify this is by design)")
        return unique

    fr_ids = [int(m.group(1)) for m in re.finditer(r"FR-(\d{3})", spec)]
    sc_ids = [int(m.group(1)) for m in re.finditer(r"SC-(\d{3})", spec)]
    nfr_ids = [int(m.group(1)) for m in re.finditer(r"NFR-(\d{3})", spec)]
    us_ids = [int(m.group(1)) for m in re.finditer(r"### User Story (\d+)", spec)]
    task_ids = [int(m.group(1)) for m in re.finditer(r"\bT(\d{3})\b", tasks)]

    print("\n1. ID Numbering")
    fr_unique = check_id_set(fr_ids, "FR", allow_gaps=True)
    check_id_set(sc_ids, "SC")
    check_id_set(nfr_ids, "NFR")
    check_id_set(us_ids, "US")
    task_unique = check_id_set(task_ids, "Task ID")

    if fr_unique:
        print(f"   FR: {len(fr_unique)} unique, range {fr_unique[0]}..{fr_unique[-1]}")
    if task_unique:
        print(f"   Task: {len(task_unique)} unique, range {task_unique[0]}..{task_unique[-1]}")


def check_task_format(files: dict, errors: list, warnings: list) -> None:
    """Check task format compliance."""
    tasks = files.get("tasks") or ""

    print("\n2. Task Format Compliance")
    proper = re.findall(r"^- \[ \] (T\d{3})(?: \[P\])?(?: \[US\d+\])? .+$", tasks, re.MULTILINE)
    all_task_like = re.findall(r"^- \[ \] .+$", tasks, re.MULTILINE)
    malformed = [l for l in all_task_like if not re.match(r"^- \[ \] T\d{3}", l)]

    print(f"   Properly formatted: {len(proper)} / {len(all_task_like)}")
    if malformed:
        errors.append(f"Malformed task lines: {len(malformed)}")
        for m in malformed[:3]:
            errors.append(f"  → {m[:80]}")


def check_story_labels(files: dict, errors: list, warnings: list) -> None:
    """Check that [Story] labels are present in US phases, absent elsewhere."""
    tasks = files.get("tasks") or ""

    print("\n3. Story Labels")
    phases = re.split(r"^## Phase (\d+):", tasks, flags=re.MULTILINE)
    # phases: [preamble, '1', 'content', '2', 'content', ...]

    setup_phases = {1, 2}  # Setup, Foundational
    polish_phases = {8, 9, 10, 11, 12, 13, 14, 15}  # Polish & cross-cutting (any phase >= 8, < 16, and not user story)

    current_phase = None
    issues = []
    for chunk in phases:
        m = re.match(r"^(\d+)$", chunk.strip())
        if m:
            current_phase = int(m.group(1))
            continue
        if current_phase is None:
            continue

        for line in chunk.split("\n"):
            t = re.match(r"^- \[ \] (T\d{3})(?: \[P\])?(?: \[(US\d+)\])?", line)
            if not t:
                continue
            has_story = bool(t.group(2))

            if current_phase in setup_phases or current_phase in polish_phases:
                if has_story:
                    issues.append(f"Phase {current_phase}: task {t.group(1)} has [Story] (should not)")
            else:
                if not has_story:
                    issues.append(f"Phase {current_phase}: task {t.group(1)} missing [Story]")

    if issues:
        errors.append(f"Story label issues: {len(issues)}")
        for i in issues[:5]:
            errors.append(f"  → {i}")
    else:
        print("   ✓ All story labels correct")


def check_cross_artifact(files: dict, errors: list, warnings: list) -> None:
    """Check that spec FRs are referenced in plan and/or tasks."""
    spec = files.get("spec") or ""
    plan = files.get("plan") or ""
    tasks = files.get("tasks") or ""

    print("\n4. Cross-Artifact FR Coverage")
    fr_in_spec = set(re.findall(r"FR-\d{3}", spec))
    fr_in_plan = set(re.findall(r"FR-\d{3}", plan))
    fr_in_tasks = set(re.findall(r"FR-\d{3}", tasks))

    print(f"   Spec references: {len(fr_in_spec)}")
    print(f"   Plan references: {len(fr_in_plan)}")
    print(f"   Tasks references: {len(fr_in_tasks)}")
    # Note: Not all FRs need explicit plan/task mention. Just informational.


def check_constitution(files: dict, errors: list, warnings: list) -> None:
    """Check that all constitution principles are referenced in plan's Constitution Check."""
    constitution = files.get("constitution")
    plan = files.get("plan")

    print("\n5. Constitution Alignment")
    if not constitution:
        warnings.append("constitution.md not found — skipping alignment check")
        print("   ⚠ constitution.md missing — skipping")
        return

    principles = re.findall(r"^### ([IVX]+\..+)$", constitution, re.MULTILINE)
    print(f"   Found {len(principles)} principles in constitution")

    if not plan:
        warnings.append("plan.md not found — cannot verify Constitution Check")
        return

    if "Constitution Check" not in plan:
        errors.append("plan.md has no 'Constitution Check' section")
        return

    # Each principle should be referenced (named or numbered) in plan's check
    missing = []
    for p in principles:
        # Principle name like "I. Offline-First" — match by roman numeral
        numeral = p.split(".")[0]
        if numeral not in plan:
            missing.append(p)
    if missing:
        warnings.append(f"Constitution principles not in plan check: {missing}")
    else:
        print(f"   ✓ All {len(principles)} principles referenced in plan")


def check_clarifications_integrated(files: dict, errors: list, warnings: list) -> None:
    """Check that no [NEEDS CLARIFICATION] markers remain in spec."""
    spec = files.get("spec") or ""

    print("\n6. Clarifications Integration")
    needs_clarification = re.findall(r"\[NEEDS CLARIFICATION[^\]]*\]", spec)
    if needs_clarification:
        errors.append(f"{len(needs_clarification)} [NEEDS CLARIFICATION] markers remaining in spec")
        for nc in needs_clarification[:3]:
            errors.append(f"  → {nc[:80]}")
    else:
        print("   ✓ No orphan [NEEDS CLARIFICATION] markers")

    if "## Clarifications" in spec:
        print("   ✓ Clarifications section present in spec")
    else:
        warnings.append("No '## Clarifications' section in spec (OK if no Q&A happened)")


def check_terminology(files: dict, errors: list, warnings: list) -> None:
    """Check for terminology drift across artifacts."""
    spec = files.get("spec") or ""
    plan = files.get("plan") or ""
    tasks = files.get("tasks") or ""

    print("\n7. Terminology Consistency")
    pairs = [
        ("Cashier (data)", "kasir (UI)", "Cashier", "kasir"),
        ("Sale (data)", "transaksi (UI)", "Sale", "transaksi"),
        ("Product (data)", "produk (UI)", "Product", "produk"),
    ]

    for label, sublabel, en, idn in pairs:
        s_en = spec.count(en)
        s_idn = spec.count(idn)
        p_en = plan.count(en)
        t_en = tasks.count(en)
        print(f"   {label} / {sublabel}: spec '{en}'={s_en} '{idn}'={s_idn}; plan '{en}'={p_en}; tasks '{en}'={t_en}")


def check_markdown_structure(files: dict, errors: list, warnings: list) -> None:
    """Sanity-check markdown structure."""
    print("\n8. Markdown Structure")
    for name, content in files.items():
        if not content:
            continue
        h1 = sum(1 for h in re.findall(r"^(#+)\s+", content, re.MULTILINE) if len(h) == 1)
        h2 = sum(1 for h in re.findall(r"^(#+)\s+", content, re.MULTILINE) if len(h) == 2)
        h3 = sum(1 for h in re.findall(r"^(#+)\s+", content, re.MULTILINE) if len(h) == 3)
        print(f"   {name}: H1={h1}, H2={h2}, H3={h3}")
        if h1 == 0 and name in ("constitution", "spec", "plan", "tasks"):
            warnings.append(f"{name}.md has no H1 — usually specs need a top-level title")


def main():
    feature_dir = find_feature_dir(sys.argv[1] if len(sys.argv) > 1 else None)
    print(f"Validating: {feature_dir}\n")

    files = load_files(feature_dir)

    errors: list[str] = []
    warnings: list[str] = []

    check_numbering(files, errors, warnings)
    check_task_format(files, errors, warnings)
    check_story_labels(files, errors, warnings)
    check_cross_artifact(files, errors, warnings)
    check_constitution(files, errors, warnings)
    check_clarifications_integrated(files, errors, warnings)
    check_terminology(files, errors, warnings)
    check_markdown_structure(files, errors, warnings)

    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"  ERRORS: {len(errors)}")
    for e in errors:
        print(f"    ❌ {e}")
    print(f"  WARNINGS: {len(warnings)}")
    for w in warnings:
        print(f"    ⚠ {w}")

    if errors:
        print(f"\n❌ {len(errors)} errors found — fix before handoff to implementation")
        sys.exit(1)
    else:
        print(f"\n✅ No errors (warnings: {len(warnings)})")
        sys.exit(0)


if __name__ == "__main__":
    main()
