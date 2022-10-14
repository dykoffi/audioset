import {
    UnstyledButtonProps,
    Group,
    Avatar,
    Text,
    ActionIcon,
} from '@mantine/core';
import { IconLock } from '@tabler/icons';
import { useDispatch } from 'react-redux';
import { logoutInvestigator } from '../services/user/userSlice';
import { AppDispatch } from '../services/store';

interface UserButtonProps extends UnstyledButtonProps {
    name?: string
    email?: string
    token?: string
    phone?: string
    town?: string
}

export default function User({ name, email, token, phone, town }: UserButtonProps) {

    const dispatch = useDispatch<AppDispatch>()

    return (
        <Group p={15}>
            <Avatar radius="xl" size={"md"} color={"teal.4"} />

            <div style={{ flex: 1 }}>
                <Text size="sm" weight={500}>
                    {name}
                </Text>

                <Text color="dimmed" size="xs">
                    {email} ({town})
                </Text>
            </div>
            <ActionIcon onClick={() => {
                dispatch(logoutInvestigator(String(token)))
            }
            }>
                <IconLock size={25} stroke={1.5} />
            </ActionIcon>
        </Group>
    );
}