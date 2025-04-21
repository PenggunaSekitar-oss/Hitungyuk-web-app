import React from 'react';
import { Route, Switch } from 'wouter';
import Dashboard from './pages/Dashboard';
import Calculator from './pages/Calculator';
import Custom from './pages/Custom';
import DataCenter from './pages/DataCenter';
import Profile from './pages/Profile';
import NotFound from './pages/not-found';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Navbar from './components/Navbar';
import BottomNavbar from './components/BottomNavbar';
import { AuthProvider, ProtectedRoute, useAuth } from './lib/auth-context';

const AuthenticatedApp = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 pb-24">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/calculator" component={Calculator} />
          <Route path="/custom" component={Custom} />
          <Route path="/datacenter" component={DataCenter} />
          <Route path="/profile" component={Profile} />
          <Route component={NotFound} />
        </Switch>
      </div>
      <BottomNavbar />
    </>
  );
};

const UnauthenticatedApp = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route>
            {() => {
              // Redirect to login for any other route when not authenticated
              window.location.href = '/login';
              return null;
            }}
          </Route>
        </Switch>
      </div>
    </>
  );
};

const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return isAuthenticated ? <AuthenticatedApp /> : <UnauthenticatedApp />;
};

const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;
