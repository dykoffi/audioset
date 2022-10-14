import { Button, Group, Stack, Select, Grid, Modal, useMantineTheme, TextInput, NumberInput, SegmentedControl, Loader, ActionIcon, Tooltip, Blockquote, Text, Container } from '@mantine/core';
import { useEffect } from 'react';

import { useState } from 'react';
import StatsSegments from '../components/stats';
import User from '../components/user';
import { IconCheck, IconChecks, IconChevronsRight, IconSquareX, IconUserPlus } from '@tabler/icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../services/store';
import { addInvestigated, getListInvestigated, getStatsInvestigated, setInvestigated, setPopup } from '../services/user/userSlice';
import { getNewAudio, getNotRecordedNb, sendAudio, setCurrentLangage, setDataAudioSource, setDataAudioTarget, setUrlAudio } from '../services/audio/audioSlice';
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';

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
  const [data, setdata] = useState({
    name: "",
    year: 0,
    genre: "",
    town: ""
  })
  const validData = data.year > 0 && data.town.trim().length > 0 && data.genre.trim().length > 0
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
      blob: blob,
      url: URL.createObjectURL(blob)
    }

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
    <>
      <Stack className='h-screen px-2' justify="flex-start" spacing="xs" sx={(theme) => ({ backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0], height: 300 })}>
        <User {...investigator} />
        <StatsSegments {...stats} />
        <Grid gutter={"xs"} align={'center'}>
          <Grid.Col span={"auto"}>
            <Select
              disabled={loadingAudio}
              placeholder="Selectionnez un participant"
              size='md'
              color={"teal.5"}
              limit={3}
              data={listInvestigated.map(elt => ({ value: elt.id_, label: `${elt.name} (${elt.year} ans, ${elt.genre}, ${elt.town})`, }))}
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
              <ActionIcon>
                <IconUserPlus onClick={() => {
                  setdata({
                    name: "",
                    year: 0,
                    genre: "",
                    town: ""
                  })
                  dispatch(setPopup(true))
                }} />
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
                <audio id="audio" controls src={urlAudio} />
                <Tooltip label="Supprimer l'audio">
                  <ActionIcon>
                    <IconSquareX size={50} onClick={() => {
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
        <Group p={"lg"} grow>
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
      </Stack>
      <Modal
        centered
        withCloseButton={false}
        title="Ajouter un nouveau participant"
        opened={popup}
        overlayColor={theme.colors.gray[2]}
        onClose={() => {
          dispatch(setPopup(false))
        }}
        overlayOpacity={0.55}
        overlayBlur={3}
      >
        <Stack spacing={"sm"}>
          <TextInput disabled={loading} label="Nom" placeholder="Nom" value={data.name} onChange={(ev) => {
            setdata({ ...data, name: ev.target.value })
          }} />
          <NumberInput disabled={loading} label="Âge" placeholder="Age" required value={data.year} onChange={(value) => {
            setdata({ ...data, year: Number(value) })
          }} />
          <TextInput disabled={loading} label="Ville" placeholder="Ville" value={data.town} onChange={(ev) => {
            setdata({ ...data, town: ev.target.value })
          }} />
          <SegmentedControl
            disabled={loading}
            color={"teal.5"}
            value={data.genre}
            onChange={(value) => {
              setdata({ ...data, genre: value })
            }}
            data={[
              { label: 'Homme', value: 'M' },
              { label: 'Femme', value: 'F' },
            ]}
          />
        </Stack>
        <Group></Group>
        <Button leftIcon={
          loading ?
            <Loader size={"sm"} variant="bars" color={"teal.4"} /> :
            <IconCheck size={20} />
        } disabled={!validData} fullWidth my={"md"} variant={"outline"} size={"md"} color={"teal.5"} onClick={() => {
          dispatch(addInvestigated(data))
        }} >Valider</Button>
      </Modal>
    </>
  );
}