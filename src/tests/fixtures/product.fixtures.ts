export function makeFakeProductProps(
  overrides: Partial<{
    name: string;
    price: number;
    stock: number;
  }> = {},
) {
  return {
    name: "Producto de prueba",
    price: 100,
    stock: 10,
    ...overrides,
  };
}