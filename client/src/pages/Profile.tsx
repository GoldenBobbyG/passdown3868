import { Navigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_USER, QUERY_ME } from '../utils/queries';
import Auth from '../utils/auth';
// This commit imports necessary modules and defines the Profile component
const Profile = () => {
    const { username: userParam } = useParams();

    const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
        variables: userParam ? { username: userParam } : undefined,
        fetchPolicy: 'network-only',
    });
// This commit uses useQuery to fetch user data based on the username parameter
    const user = data?.me || data?.user || {};
// This commit destructures the user data from the query response
    if (
        Auth.loggedIn() &&
        userParam &&
        Auth.getProfile().data.username === userParam
    ) {
        return <Navigate to="/me" replace />;
    }

    if (loading) {
        return <div>Loading...</div>;
    }
// This commit handles the loading state of the query and if the user is logged in and viewing their own profile, it redirects them to the '/me' route.
    if (!user?.username) {
        return (
            <h4>
                You need to be logged in to see this. Use the navigation links above to
                sign up or log in!
            </h4>
        );
    }

    return (
        <div>
            <div className="flex-row justify-center mb-3">
                <h2 className="col-12 col-md-10 bg-dark text-light p-3 mb-5">
                    Viewing {userParam ? `${user.username}'s` : 'your'} profile.
                </h2>
            </div>
        </div>
    );
};

export default Profile;
