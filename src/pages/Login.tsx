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
    Notification,
} from '@mantine/core';

import React, { useState } from "react"
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { AppDispatch, RootState } from '../services/store';
import { loginInvestigator, setNotif } from '../services/user/userSlice';

export default function Authentication() {

    const dispatch = useDispatch<AppDispatch>()

    const theme = useMantineTheme()
    const loading = useSelector((state: RootState) => state.user.loading)
    const notif = useSelector((state: RootState) => state.user.notif)
    const navigate = useNavigate()
    const [data, setdata] = useState({
        email: "",
        password: ""
    })

    const validData = data.email.trim().length > 0 && data.password.trim().length > 0

    return (
        <>
            <Container size={420} my={40}>
                <Title
                    align="center"
                    sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
                >
                    Sign in
                </Title>
                <Text color="dimmed" size="sm" align="center" mt={5}>
                    Do not have an account yet ?{' '}
                    <Anchor color={"teal.4"} size="sm" onClick={() => navigate("/signup")}>
                        Create account
                    </Anchor>
                </Text>

                <Stack p={10} mt={30} spacing="md">
                    <TextInput size='md' label="Email" value={data.email} onChange={(ev) => {
                        setdata({ ...data, email: ev.target.value })
                    }} required />
                    <PasswordInput value={data.password} onChange={(ev) => {
                        setdata({ ...data, password: ev.target.value })
                    }} size='md' label="Password" required />
                    <Button disabled={!validData} variant="outline" color={"teal.4"} mt="xl" size='md' onClick={() => {
                        dispatch(loginInvestigator(data))
                    }}>
                        Sign in
                    </Button>
                    {
                        notif &&
                        <Notification color="red" onClose={() => { dispatch(setNotif(false)) }}>
                            Identifiants incorrects, veuillez réessayer
                        </Notification>
                    }
                </Stack>
            </Container>
            <LoadingOverlay loader={<Loader color={"teal.4"} size={"lg"} variant="bars" />} visible={loading} overlayOpacity={0.6} overlayColor={theme.colors.gray[1]} overlayBlur={4} />
        </>
    );
}