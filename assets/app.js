import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Navbar } from './js/components/navbar';
import { Home } from './js/pages/HomePage';
import {HashRouter, Switch, Route, withRouter, Redirect} from 'react-router-dom'

/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you import will output into a single css file (app.css in this case)
import './styles/app.css';
import CustomersPage from './js/pages/CustomersPage';
import InvoicesPage from './js/pages/InvoicesPage';
import { IsAuthenticated, Setup } from './js/services/AuthApi';
import Login from './js/pages/LoginPage';
import Customer from './js/pages/CustomerPage';
import Invoice from './js/pages/InvoicePage';
import Register from './js/pages/RegisterPage';


// Need jQuery? Install it with "yarn add jquery", then uncomment to import it.
// import $ from 'jquery';



Setup()

const PrivaeRoute = ({ path, isAuthenticated, component}) => {
   return isAuthenticated ? <Route path={path} isAuthenticated={isAuthenticated} component={component} />
                    : <Redirect to="/login" />
}

const App = () => {

    const NavbarWithRouter = withRouter(Navbar)

    const [isAuthenticated, setIsAuthenticated] = useState(IsAuthenticated)

    return <HashRouter>
        <NavbarWithRouter  isAuthenticated={isAuthenticated} onLogout={setIsAuthenticated} />
        
        <main className="container pt-5">
            <Switch>
                <Route 
                    path="/login"  
                    render={props => (
                        <Login onLogin={setIsAuthenticated} {...props} />
                    )}
                />
                <Route 
                path="/register"  
                render={props => (
                    <Register onLogin={setIsAuthenticated} {...props} />
                )}
            />
                <PrivaeRoute path="/customers/:id" isAuthenticated={isAuthenticated} component={Customer} />
                <PrivaeRoute path="/customers" isAuthenticated={isAuthenticated} component={CustomersPage} />
                <PrivaeRoute path="/invoices/:id" isAuthenticated={isAuthenticated} component={Invoice} />
                <PrivaeRoute path="/invoices" isAuthenticated={isAuthenticated} component={InvoicesPage} />
                <Route path="/" component={Home} />
            </Switch>
        </main>
    </HashRouter>;
};

ReactDOM.render(<App />, document.querySelector('#app'))