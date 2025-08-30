import React from 'react'
import ReactDOM from 'react-dom/client'
import {App} from './App'
import './index.css'
import {light, ThemeProvider} from '@v-uik/theme'
import {DateLibAdapterProvider} from "@v-uik/date-picker";
import {DateFnsAdapter} from "@v-uik/date-picker/dist/adapters/date-fns";
import {BrowserRouter} from "react-router-dom";
import {ru} from "date-fns/locale";

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
        <ThemeProvider theme={light}>
            <DateLibAdapterProvider
                dateAdapter={DateFnsAdapter}
                options={{
                    locale: ru,
                    formats: {weekdayShort: 'EEEEEE', monthShort: 'LLL'},
                }}>
                    <BrowserRouter>
                        <App/>
                    </BrowserRouter>
            </DateLibAdapterProvider>
        </ThemeProvider>

)
