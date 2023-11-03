import { ComponentType, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux'; // You can replace this with your authentication logic
import { selectAuthState } from '@/redux/reducers/auth.reducer'; // Replace with your Redux setup

// Define the login route
const loginRoute = '/';

export const withPrivateRoute = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const PrivateRoute: React.FC<P> = (props) => {
    const router = useRouter();
    const authData = useSelector(selectAuthState);
    const isAuthenticated = authData?.isAuthenticated ? authData.isAuthenticated : false;

    useEffect(() => {
      if (!isAuthenticated) {
        // If user is not authenticated, redirect to the login route
        router.push(loginRoute);
      }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
      // If user is not authenticated, you can render a loading spinner or a message here
      return <div>Loading...</div>;
    }

    // If user is authenticated, render the wrapped component
    return <WrappedComponent {...props as P} />;
  };

  return PrivateRoute;
};
