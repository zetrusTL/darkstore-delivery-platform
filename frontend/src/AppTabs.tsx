import React, {FC, useEffect, useState} from 'react'
// @ts-ignore
import {ReactComponent as PeopleLogo} from './assets/people.svg'
// @ts-ignore
import {ReactComponent as Logo} from './assets/logo.svg'
import {Route, Routes, useNavigate} from "react-router-dom"
import {Bar, BarButton, BarDate, BarDivider, BarMenuItem, SubBar} from "@v-uik/bar";
import {NotificationContainer} from "@v-uik/notification";
import Goods from "./Goods";
import Orders from "./Orders";
import Cart from "./Cart";
import {useMutation} from "@apollo/client";
import {CREATE_CUSTOMER} from "./graphql_requests";
import {USER_ID} from "./AppProvider";

export const AppTabs: FC = () => {

    //Автоматическое создание пользователя в DataSpace на основании ID из KeyCloak
    const [mutateFunction] = useMutation(CREATE_CUSTOMER, {
        variables: {
            customerID: USER_ID
        }
    })

    try {
        useEffect(() => {
            mutateFunction()
        }, [])
    } catch (e) {
        console.log(e)
    }

    const navigate = useNavigate()

    const [selected, setSelected] = useState(1)

    const setPage = (selectedId: number, page: string) => {
        setSelected(selectedId)
        navigate(page, {replace: false})
    }

    return <>
            <Bar
                style={{
                    position: 'absolute',
                }}
                direction="horizontal"
                kind="light"
                expanded>
                <BarButton icon={<Logo/>}/>
                <BarDate/>
                <BarMenuItem style={{marginLeft: 'auto'}}>{USER_ID}</BarMenuItem>
                <BarDivider/>
                <BarButton icon={<PeopleLogo/>}/>
            </Bar>

            <SubBar
                style={{
                    position: 'absolute',
                    top: 48,
                    left: 0,
                }}
                direction="horizontal"
                kind="lighter"
                expanded
            >
                <BarMenuItem selected={selected === 1}
                             onClick={() => setPage(1, 'goods')}>Выбор товаров</BarMenuItem>
                <BarMenuItem selected={selected === 2}
                             onClick={() => setPage(2, 'orders')}>Список заказов</BarMenuItem>
                <BarMenuItem selected={selected === 3}
                             onClick={() => setPage(3, 'cart')}>Корзина</BarMenuItem>
            </SubBar>

            <div>
                <Routes>
                    <Route path="/" element={<Goods/>}/>
                    <Route path="goods" element={<Goods/>}/>
                    <Route path="orders" element={<Orders/>}/>
                    <Route path="cart" element={<Cart/>}/>
                </Routes>
            </div>

            <NotificationContainer
                position="top-right"
                autoClose={5000}
                limit={1}
                closeButtonAriaLabel="Закрыть"
            />
    </>
}

export default AppTabs
