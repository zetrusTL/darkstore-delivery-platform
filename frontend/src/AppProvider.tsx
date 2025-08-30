import React, {FC, MutableRefObject, useState} from 'react';
import {ApolloClient, ApolloProvider, InMemoryCache, NormalizedCacheObject} from '@apollo/client';

import {AppTabs} from './AppTabs'

import {AppContext, UserInfo} from "./AppContext"

import Keycloak, {KeycloakInstance} from 'keycloak-js';

export interface ServiceData {
    appAddress: string
    initApolloClient: MutableRefObject<boolean>
}

export let USER_ID = ""

export const AppProvider: FC<ServiceData> = ({ appAddress, initApolloClient }) => {

    const [keycloak, setKeycloak] = useState<KeycloakInstance>(new Keycloak({
        url: "https://iam-sandbox.bootcamp-labs.ru/auth/",
        realm: "peaceful_whale",
        clientId: "delivery-front"
    }))
    const [authenticated, setAuthenticated] = useState<boolean>(false)
    const [userInfo, setUserInfo] = useState<UserInfo>()

    const initClient = () => {
        return new ApolloClient({
            cache: new InMemoryCache({addTypename: false}),
            uri: '/graphql',
            headers: {
                 "Authorization": "Bearer " + keycloak.token,
                "Content-Type": "application/json"
            }
        })
    }

    var apolloClient: ApolloClient<NormalizedCacheObject> | undefined

    if (initApolloClient.current) {

        if (authenticated) {

            apolloClient = initClient()

            if (!userInfo) {
                keycloak.loadUserInfo().then(value => {
                    setUserInfo(value as UserInfo)
                })
            }

            if (userInfo) {
                initApolloClient.current = false
                USER_ID = userInfo.sub

                return (
                    <AppContext.Provider value={{ keycloak: keycloak, userInfo: userInfo }}>
                        <ApolloProvider client={apolloClient!}>
                            <AppTabs />
                        </ApolloProvider>
                    </AppContext.Provider>
                )
            }
        } else {
            keycloak.init({ onLoad: 'login-required' }).then(auth => {
                setKeycloak(keycloak)
                setAuthenticated(auth)
            })
        }

        return (
            <div>Идет загрузка</div>
        )

    }

    return <p>Пожалуйста, введите учетные данные...</p>
}
