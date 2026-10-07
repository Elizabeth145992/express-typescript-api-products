describe("Mi primera prueba", () => {  // El "describe" agrupa pruebas relacionadas.
  it("debería sumar dos números", () => { // El "it" describe qué comportamiento estamos comprobando.//
    const result = 2 + 3; // Es la lógica que queremos probar.

    expect(result).toBe(5); // Aquí hacemos la comprobación: "Espero que result sea 5".
                            // Si es 5 → ✅ pasa.
                            // Si es cualquier otra cosa → ❌ falla
  });
});