export function parseCurrency(value) {
    return value?.toLocaleString('es-Ar', {
        style: 'currency',
        currency: 'ARS'
    })
}

export function passwordGenerator() {
    const options = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let password = ''
    for (let i = 0; i < 8; i++) {
        let char = Math.round(Math.random() * options.length)
        password += options.charAt(char)
    }
    return password
}

export function paymentStatus(status) {
    if (status === 'preparing') return 'Preparando'
    if (status === 'traveling') return 'Viajando'
    if (status === 'delivered') return 'Entregado'
    if (status === 'approved') return 'Pagado'
    if (status === 'pending') return 'Pendiente'
    if (status === 'in_process') return 'Pendiente'
    return 'Cancelado'
}

export function paymentStatusColor(status) {
    if (status === 'preparing') return 'info.light'
    if (status === 'traveling') return 'info.main'
    if (status === 'delivered') return 'info.dark'
    if (status === 'approved') return 'success.main'
    if (status === 'pending') return 'warning.main'
    if (status === 'in_process') return 'warning.main'
    return 'error.main'
}