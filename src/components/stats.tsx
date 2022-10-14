import { createStyles, Progress, Box, Text, Group, Paper, SimpleGrid, Loader } from '@mantine/core';
import { IconDeviceAnalytics } from '@tabler/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../services/store';

const useStyles = createStyles((theme) => ({
  progressLabel: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1,
    fontSize: theme.fontSizes.sm,
  },

  stat: {
    borderBottom: '3px solid',
    paddingBottom: 5,
  },

  statCount: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1.3,
  },

  diff: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    display: 'flex',
    alignItems: 'center',
  },

  icon: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4],
  },
}));

interface StatsSegmentsProps {
  total: string;
  diff: number;
  data: {
    label: string;
    count: string;
    part: number;
    color: string;
  }[];
}

export default function StatsSegments({ total, diff, data }: StatsSegmentsProps) {
  const { classes } = useStyles();

  const segments = data.map((segment) => ({
    value: segment.part,
    color: segment.color,
    label: segment.part > 15 ? `${segment.part}%` : undefined,
  }));

  const notRecordedNb = useSelector((state: RootState) => state.audio.notRecordedNb)
  const loading = useSelector((state: RootState) => state.user.statsLoading)

  const descriptions = data.map((stat) => (
    <Box key={stat.label} sx={{ borderBottomColor: stat.color }} className={classes.stat}>
      <Text transform="uppercase" size="xs" color="dimmed" weight={700}>
        {stat.label}
      </Text>
      <Group position="apart" align="flex-end" spacing={0}>
        <Text weight={700} color="dimmed">{stat.count} <small>audio(s)</small></Text>
        <Text color={stat.color} weight={700} size="sm" className={classes.statCount}>
          {stat.part}%
        </Text>
      </Group>
    </Box>
  ));

  return (
    <Paper withBorder p="md" radius="md">
      <Group position="apart">
        <Group align="flex-end" spacing="xs">
          <Text size="xl" weight={700}>
            {diff}/<small>{total} enregistré(s)</small>
          </Text>
        </Group>
        {
          loading ?
            <Loader color={"teal.4"} size={"sm"} variant="bars" /> :
            <IconDeviceAnalytics size={20} className={classes.icon} stroke={1.5} />
        }
      </Group>

      <Text color="dimmed" size="sm">
        Il reste encore <b>{notRecordedNb}</b> audios à enregistrer
      </Text>

      <Progress
        sections={segments}
        size={20}
        classNames={{ label: classes.progressLabel }}
        mt={"xs"}
      />
      <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'xs', cols: 2 }]} mt="xs">
        {descriptions}
      </SimpleGrid>
    </Paper>
  );
}