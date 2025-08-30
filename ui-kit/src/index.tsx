import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {BrowserRouter} from "react-router-dom";
import {DateFnsAdapter} from '@v-uik/date-picker/dist/adapters/date-fns'
import {ru} from 'date-fns/locale'
import {DateLibAdapterProvider} from '@v-uik/date-picker'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
    <React.StrictMode>
       <DateLibAdapterProvider dateAdapter={DateFnsAdapter}
            options={{
                locale: ru,
                formats: { weekdayShort: 'EEEEEE', monthShort: 'LLL' },
            }}
        >
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </DateLibAdapterProvider>
    </React.StrictMode>
)
