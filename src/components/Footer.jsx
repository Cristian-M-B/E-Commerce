import { AppBar, Toolbar, Grid, Typography } from '@mui/material'

export default function Footer() {
    return (
        <AppBar position='static'>
            <Toolbar style={{ height: '8vh' }}>
                <Grid container justifyContent='center'>
                    <Typography>E-Commerce | Copyright © {new Date().getFullYear()}</Typography>
                </Grid>
            </Toolbar>
        </AppBar>
    )
}