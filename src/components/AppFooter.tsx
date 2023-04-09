import { Group, Stack, Text, createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  footer: {
    justifyContent: "center",
    alignItems: "center",
    borderTop: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
      }`,
  },

  inner: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    flexDirection: "column",
    marginLeft: 0,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
  },
}))

export default function AppFooter() {
  const { classes } = useStyles();
  return (
    <Group className={classes.footer}>
      <Stack className={classes.inner}>
        <Text size="xs" color="dimmed">
          <br />
          {`Designed & built by Data354, 2023 CIV 🇨🇮`}
          <br />
          {`All rights reserved`}
        </Text>
      </Stack>
    </Group>
  );
};