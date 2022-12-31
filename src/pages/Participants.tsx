import { Button, Group, Stack, Select, Grid, Modal, useMantineTheme, TextInput, NumberInput, SegmentedControl, Loader, ActionIcon, Tooltip, Blockquote, Text, Container, Center, Slider, Space } from '@mantine/core';
import { useEffect } from 'react';

import StatsSegments from '../components/stats';
import User from '../components/user';
import { IconCheck, IconChecks, IconChevronsRight, IconSquareX, IconUserPlus } from '@tabler/icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../services/store';
import { addInvestigated, getListInvestigated, getStatsInvestigated, setInvestigated, setPopup } from '../services/user/userSlice';
import { getNewAudio, getNotRecordedNb, sendAudio, setCurrentLangage, setDataAudioSource, setDataAudioTarget, setUrlAudio } from '../services/audio/audioSlice';
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import { useForm } from '@mantine/form';

export default function Participants() {

  const theme = useMantineTheme();
  const investigator = useSelector((state: RootState) => state.user.investigator)
  const investigated = useSelector((state: RootState) => state.user.investigated)
  const listInvestigated: any[] = useSelector((state: RootState) => state.user.listInvestigated)
  const loading = useSelector((state: RootState) => state.user.loading)
  const loadingAudio = useSelector((state: RootState) => state.audio.loading)
  const popup = useSelector((state: RootState) => state.user.popup)
  const stats = useSelector((state: RootState) => state.user.stats)

  const currentAudio = useSelector((state: RootState) => state.audio.currentAudio)
  const dataAudioSource = useSelector((state: RootState) => state.audio.dataAudioSource)
  const dataAudioTarget = useSelector((state: RootState) => state.audio.dataAudioTarget)
  const currentLangage = useSelector((state: RootState) => state.audio.currentLangage)
  const urlAudio = useSelector((state: RootState) => state.audio.urlAudio)

  const recorderControls = useAudioRecorder()
  const dispatch = useDispatch<AppDispatch>()

  const MARKS = [
    { value: 15, label: '15' },
    { value: 25, label: '25' },
    { value: 35, label: '35' },
    { value: 45, label: '45' },
    { value: 55, label: '55' },
    { value: 65, label: '65' },
    { value: 70, label: '70+' },
  ];

  const form = useForm({
    initialValues: {
      year: 0,
      country: "",
      town: "",
      genre: "M"
    },

    validate: {
      year: (value) => (Math.ceil(value) > 0 ? null : 'age must be great than 0')
    },
  });

  const validAudio = investigated && dataAudioSource && dataAudioTarget && currentAudio

  const sendAudioData = () => {
    if (validAudio) {
      dispatch(sendAudio({ blobSource: dataAudioSource.blob, blobTarget: dataAudioTarget.blob, audioId: String(currentAudio.id_), ref: String(currentAudio.ref), userId: String(investigated) }))
      dispatch(setDataAudioSource(null))
      dispatch(setDataAudioTarget(null))
      dispatch(getNewAudio(investigated))
    }
  }

  const saveAudio = (blob: Blob) => {
    let data = {
      blob: blob.slice(0, blob.size, "audio/ogg"),
      url: URL.createObjectURL(blob)
    }

    console.log(data.blob);
    

    if (currentLangage === "source") {
      dispatch(setDataAudioSource(data))
    } else {
      dispatch(setDataAudioTarget(data))
    }
  }

  useEffect(() => {
    dispatch(getListInvestigated())
    dispatch(getStatsInvestigated())
    dispatch(getNotRecordedNb())
  }, [])


  useEffect(() => {
    if (investigated) {
      dispatch(getNewAudio(Number(investigated)))
    }
  }, [investigated])

  return (
    <Container className='h-screen' size={500} px={20}>
      <Stack justify="flex-start" className='h-full' spacing="xs">
        <User {...investigator} />
        <StatsSegments {...stats} />
        <Grid gutter={"xs"} align={'center'}>
          <Grid.Col span={"auto"}>
            <Select
              disabled={loadingAudio}
              placeholder="Selectionnez un participant"
              size='md'
              color={"teal.5"}
              limit={5}
              data={listInvestigated.map(elt => ({ value: elt.id_, label: `${elt.year} ans, ${elt.genre}, ${elt.town}/${elt.country}`, }))}
              searchable
              maxDropdownHeight={400}
              nothingFound="Nobody here"
              onChange={(value) => {
                dispatch(setInvestigated(value))
              }}
            />
          </Grid.Col>
          <Grid.Col span={"content"}>
            <Tooltip label="Ajouter un participant">
              <ActionIcon onClick={() => {
                dispatch(setPopup(true))
              }}>
                <IconUserPlus />
              </ActionIcon>
            </Tooltip>
          </Grid.Col>
        </Grid>
        <Stack className='flex-1'>
          {
            loadingAudio &&
            <Container>
              <Loader color={"teal.4"} size={"sm"} variant="bars" />
            </Container>
          }
          {currentAudio && !loadingAudio &&
            <>
              <Blockquote cite="Sélectionnez le langage à enregistrer (Français ou Dioula)">
                {currentAudio.sourceLang}
              </Blockquote>
            </>
          }
          <Group position='right'>
            <AudioRecorder onRecordingComplete={saveAudio} recorderControls={recorderControls} classes={{
              AudioRecorderClass: `shadow-none ${!(currentAudio && !loadingAudio) && "hidden"}`,
              AudioRecorderStartSaveClass: "opacity-40",
              AudioRecorderDiscardClass: "opacity-40",
              AudioRecorderPauseResumeClass: "opacity-40",
            }} />
          </Group>

          <SegmentedControl
            color={"teal.5"}
            onChange={(value) => { dispatch(setCurrentLangage(value)) }}
            data={[
              { label: 'Francais', value: 'source' },
              { label: 'Dioula', value: 'target' },
            ]}
          />
          {
            urlAudio ?
              <Group>
                <audio className='flex-1' id="audio" controls src={urlAudio} />
                <Tooltip label="Supprimer l'audio">
                  <ActionIcon>
                    <IconSquareX className='opacity-50' size={50} color="red" onClick={() => {
                      dispatch(setUrlAudio(null))
                      if (currentLangage === "source") {
                        dispatch(setDataAudioSource(null))
                      } else {
                        dispatch(setDataAudioTarget(null))
                      }
                    }} />
                  </ActionIcon>
                </Tooltip>
              </Group>
              :
              <div className='text-center'><Text size={"sm"} color={"dimmed"}>Aucun audio enregistré</Text></div>
          }
        </Stack>
        <Group py={"lg"} grow>
          <Button
            onClick={sendAudioData}
            rightIcon={<IconChecks />}
            disabled={!validAudio} size='md' variant='outline' color="teal.5">Envoyer</Button>
          <Button rightIcon={<IconChevronsRight />}
            disabled={!currentAudio || loadingAudio} size='md' variant='outline' color="teal.5" onClick={() => {
              dispatch(setDataAudioSource(null))
              dispatch(setDataAudioTarget(null))
              dispatch(setUrlAudio(null))
              dispatch(getNewAudio(Number(investigated)))
            }}>Passer</Button>
        </Group>
        <Center p={"xs"}>
          <Text size={'sm'} color={"dimmed"}> Designed and powered by data354</Text>
        </Center>
      </Stack>
      <Modal
        centered
        withCloseButton={false}
        title="Ajouter un nouveau participant"
        opened={popup}
        overlayColor={theme.colors.gray[2]}
        onClose={() => {
          dispatch(setPopup(false))
          form.reset()
        }}
        overlayOpacity={0.55}
        overlayBlur={3}
      >
        <form onSubmit={form.onSubmit((values) => {
          dispatch(addInvestigated(values))
        })}>
          <Stack spacing={"sm"}>
            <Text>Age</Text>
            <Slider
              defaultValue={20}
              showLabelOnHover={false}
              min={15}
              max={70}
              step={5}
              marks={MARKS}
              color={"teal.5"}
              disabled={loading}
              {...form.getInputProps("year")}
            />
            <Space />
            <TextInput required disabled={loading} label="Pays" placeholder="Pays" {...form.getInputProps("country")} />
            <TextInput required disabled={loading} label="Ville" placeholder="Ville" {...form.getInputProps("town")} />
            <SegmentedControl
              aria-required
              disabled={loading}
              color={"teal.5"}
              {...form.getInputProps('genre', { type: "checkbox" })}
              defaultValue="M"
              data={[
                { label: 'Homme', value: 'M' },
                { label: 'Femme', value: 'F' },
              ]}
            />
          </Stack>
          <Button disabled={loading} leftIcon={
            loading ?
              <Loader size={"sm"} variant="bars" color={"teal.4"} /> :
              <IconCheck size={20} />
          } type="submit" fullWidth my={"md"} variant={"outline"} size={"md"} color={"teal.5"}>Valider</Button>
        </form>
      </Modal>
    </Container>
  );
}