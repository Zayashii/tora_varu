import PropTypes from 'prop-types';
// sections
import { UserDetailView } from 'src/sections/user/view';
// import { getUserDataById } from 'src/api/user';
// import { useSnackbar } from 'src/components/snackbar';
// import { useAuthContext } from 'src/auth/hooks';
// import { useRouter } from 'src/routes/hooks';


// ----------------------------------------------------------------------

export const metadata = {
    title: 'Dashboard: User Detail',
};

export default async function UserDetailPage({ params }) {
    const { id } = params;

    // const { enqueueSnackbar } = useSnackbar();
    // const { logout } = useAuthContext();
    // const router = useRouter();

    // try {
    //     const { success, data } = await getUserDataById({ dataid: id })
    //     if (!success) {
    //         enqueueSnackbar("Дахин нэвтэрнэ үү!", { variant: 'error' })
    //         logout()
    //         router.push(paths.auth.jwt.login);
    //         return;
    //     }
    //     setUserData(data.datalist[0])
    // } catch (error) {
    //     console.log("catch error ", error);
    //     // setIsDetailLoading(false);
    // }

    return <UserDetailView id={id} />;
}