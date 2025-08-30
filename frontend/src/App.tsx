import React, {FC, useRef} from 'react'
import {AppProvider} from './AppProvider'

export const App: FC = () => {

    const initApolloClient = useRef<boolean>(true)

    return (
        <AppProvider appAddress={process.env.DS_ENDPOINT!}
                     initApolloClient={initApolloClient} />
    )
}