import { Access } from 'payload';

export const isAdmin: Access = ({ req }) => {
  return req.user?.role === 'admin';
};

export const isAdminOrEditor: Access = ({ req }) => {
  return ['admin', 'editor'].includes(req.user?.role);
};

export const readOnly: Access = ({ req }) => {
  return req.user?.role === 'admin' ? true : { id: { equals: req.user?.id } };
};
