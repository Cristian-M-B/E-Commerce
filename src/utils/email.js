import nodemailer from 'nodemailer'
import { parseCurrency } from '../utils/functions'

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

export const registration = (user) => {
    return {
        from: `E-Commerce <${process.env.EMAIL}>`,
        to: user.email,
        subject: 'Bienvenido a E-Commerce',
        html: `
            <h4>¡Hola ${user.firstName}, ya sos parte de la comunidad de E-Commerce!</h4>
            <h5>Tus Datos de Usuario</h5>
            <ul>
                <p>Nombre: ${user.firstName}</p>
                <p>Apellido: ${user.lastName}</p>
                <p>Documento: ${user.document}</p>
                <p>E-mail: ${user.email}</p>
            </ul>
            <p>Si deseas editar tu información puedes hacerlo llendo a tu Perfil y seleccionando la opción Datos de Usuario.</p>
            <p>Por motivos de seguridad no mostramos tu contraseña.</p>
        `
    }
}

export const order = (order) => {
    return {
        from: `E-Commerce <${process.env.EMAIL}>`,
        to: order.user.email,
        subject: 'Detalle de Compra',
        html: `
            <h4>¡Hola ${order.user.firstName}, gracias por elegirnos!</h4>
            <h5>Detalle de la Compra</h5>
            ${order.products.map(product => (
                `
                    <ul>
                        <h5>${product.name}</h5>
                        <img src=${product.images[0]} width='90' height='90' style='margin-right: 20px' />
                        <p>Cantidad: ${product.quantity}</p>
                        <p>Precio Unitario: ${parseCurrency(product.price)}</p>
                        <p>SubTotal: ${parseCurrency(product.quantity * product.price)}</p>
                    </ul>
                `
            ))}
            <p>TOTAL: ${parseCurrency(order.products.reduce((acc, product) => acc += (product.quantity * product.price), 0))}</p>
        `
    }
}

export const privileges = (user) => {
    return {
        from: `E-Commerce <${process.env.EMAIL}>`,
        to: user.email,
        subject: 'Cambio de Privilegios',
        html: `
            <h4>¡Hola ${user.firstName}, hemos cambiado tus privilegios dentro de E-Commerce!</h4>
            <p>Veras reflejado dicho cambio cuando inicies sesión en tu cuenta de E-Commerce o cerrando sesión y volviendo a iniciar en caso que tengas la sesión abierta.</p>
            <p>¡Muchas gracias por formar parte de E-Commerce!</p>
        `
    }
}

export const resetPassword = (email, password) => {
    return {
        from: `E-Commerce <${process.env.EMAIL}>`,
        to: email,
        subject: 'Reseteo de Contraseña',
        html: `
            <h4>Tu nueva contraseña es: ${password}</h4>
            <p>Una vez que ingreses, ve a tu perfil y cambia tu contraseña por una nueva.</p>
        `
    }
}
