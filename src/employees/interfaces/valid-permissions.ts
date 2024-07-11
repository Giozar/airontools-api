export interface ValidatePermissions {
  products: Products;
  employee: Employee;
}

enum Products {
  create = 'create',
  read = 'read',
  update = 'update',
  delete = 'delete',
}

enum Employee {
  create = 'create',
  read = 'read',
  update = 'update',
  delete = 'delete',
}
