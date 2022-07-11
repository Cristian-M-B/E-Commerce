import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#24292f'
        },
        secondary: {
            main: '#ffa533'
        }
    },
});

export const darkTheme = createTheme({
    palette: {
        primary: {
            main: '#ffa533'
        },
        secondary: {
            main: '#24292f'
        }
    },
});