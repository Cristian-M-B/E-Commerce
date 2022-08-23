export function parseCurrency(value) {
    return value?.toLocaleString('es-Ar', {
        style: 'currency',
        currency: 'ARS'
    })
}