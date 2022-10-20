import {
    TextInput,
    PasswordInput,
    Anchor,
    Title,
    Text,
    Container,
    Button,
    LoadingOverlay,
    Stack,
    Loader,
    useMantineTheme,
    Center,
    Notification,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { AppDispatch, RootState } from '../services/store';
import { addInvestigator, setNotif } from '../services/user/userSlice';

export default function Signup() {

    const theme = useMantineTheme()
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()

    const loading = useSelector((state: RootState) => state.user.loading)
    const notif = useSelector((state: RootState) => state.user.notif)


    const form = useForm({
        initialValues: {
            name: "",
            email: "",
            town: "",
            password: "",
            confirmPassword: "",
            phone: ""
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            confirmPassword: (value, values) => (value !== values.password ? 'Passwords did not match' : null)
        },
    });

    useEffect(() => {
        dispatch(setNotif(false))
    }, [])

    return (
        <>
            <Container className='h-screen' size={500} px={20} pt={40}>
                <form className='h-full' onSubmit={form.onSubmit((values) => dispatch(addInvestigator({ ...values, confirmPassword: undefined })))}>
                    <Stack className='h-full'>
                        <Stack className='flex-1'>
                            <Title
                                align="center"
                                sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
                            >
                                Sign up
                            </Title>
                            <Text color="dimmed" size="sm" align="center" mt={5}>
                                Do you have an account already ?{' '}
                                <Anchor color={"teal.4"} size="sm" onClick={() => navigate("/signin")}>
                                    Sign in
                                </Anchor>
                            </Text>
                            <Stack p={10} mt={10} spacing="md">
                                <TextInput size='md' label="Name" {...form.getInputProps("name")} required />
                                <TextInput size='md' label="Email" {...form.getInputProps("email")} required type={"email"} />
                                <TextInput size='md' label="City" {...form.getInputProps("town")} required />
                                <TextInput size='md' label="Phone"  {...form.getInputProps("phone")} required type={"tel"} />
                                <PasswordInput size='md' label="Password" {...form.getInputProps("password")} required />
                                <PasswordInput size='md' label="Confirm Password" {...form.getInputProps("confirmPassword")} required />
                                <Notification hidden={!notif} color="red" onClose={() => { dispatch(setNotif(false)) }}>
                                    Une erreur s'est produite, vérifiez que le mail n'est pas déjà utilisé.                                    
                                </Notification>
                            </Stack>
                        </Stack>
                        <Stack px={10}>
                            <Button disabled={loading} type='submit' variant="outline" color={"teal.4"} size='md' fullWidth >Sign up</Button>
                        </Stack>
                        <Center p={"xs"}>
                            <Text size={'sm'} color={"dimmed"}> Designed and powered by data354</Text>
                        </Center>
                    </Stack>
                </form>
            </Container>
            <LoadingOverlay loader={<Loader color={"teal.4"} size={"lg"} variant="bars" />} visible={loading} overlayOpacity={0.6} overlayColor={theme.colors.gray[1]} overlayBlur={4} />
        </>
    );
}