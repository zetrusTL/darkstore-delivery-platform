import React from 'react';
import {Bar, BarButton, BarMenuItem, BarDivider, SubBar, BarDate} from '@v-uik/bar';
import {ReactComponent as PeopleLogo} from './assets/people.svg'
import {ReactComponent as Logo} from './assets/logo.svg'
import {Good} from "./Good";
import {NotificationContainer} from "@v-uik/notification";
import {Route, Routes, useNavigate} from "react-router-dom";
import Delivery from "./Delivery";
import Darkstore from "./Darkstore";

function App() {

    const navigate = useNavigate()
 
    const [selected, setSelected] = React.useState(1)
 
    const setPage = (selectedId: number, page: string) => {
        setSelected(selectedId)
        navigate(page, {replace: false})
    }


    return  <>
        <Bar kind="light">
            <BarButton icon={<Logo/>}/>
            <BarDate/>
            <BarMenuItem style={{marginLeft: 'auto'}}>Администратор</BarMenuItem>
            <BarDivider/>
            <BarButton icon={<PeopleLogo/>}/>
        </Bar>
        <SubBar
            style={{
                top: 48
                }}
            kind="light"
            >
                <BarMenuItem selected={selected === 1}
                             onClick={() => setPage(1, 'delivery')}>Доставка</BarMenuItem>
            <BarMenuItem selected={selected === 2}
                         onClick={() => setPage(2, 'good')}>Товары</BarMenuItem>
            <BarMenuItem selected={selected === 3}
                         onClick={() => setPage(3, 'darkstore')}>Адреса складов</BarMenuItem>

            </SubBar>
            <div>
            <Routes>
                <Route path="/" element={<Delivery />} />
                <Route path="delivery" element={<Delivery />} />
                <Route path="good" element={<Good />} />
                <Route path="darkstore" element={<Darkstore />} />
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

export default App; // Добавляем экспорт по умолчанию