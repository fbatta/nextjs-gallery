import { GetServerSidePropsContext } from 'next';
import Link from "next/link";
import Head from 'next/head';
import { Fragment } from "react";
import { Center, Heading, Grid, Flex, Button, Box } from "@chakra-ui/react";
import { FolderGridItem } from '../components/folderGridItem';
import { ImageGridItem } from "../components/imageGridItem";
import { GalleryBreadcrumb } from '../components/breadcrumb';

interface ServerSideProps {
  currentDirectoryPath: string;
  error?: string;
  directories?: string[];
  images?: string[];
}

export default function Home(props: ServerSideProps) {
  const hasError = props.error && true;
  const hasFolders = props.directories && props.directories.length > 0;
  const hasImages = props.images && props.images.length > 0;

  if (hasError) {
    return (
      <>
        {/* add stuff to head */}
        <Head>
          <title>Gallery</title>
        </Head>
        <Center mt={4}>
          <Heading>Gallery</Heading>
        </Center>
        <Flex h="xl" alignItems="center" justifyContent="center" flexDirection="column">
          <Heading as="h2" size="lg" color="gray.400">Error: {props.error}</Heading>
          <Link href="/">
            <Button mt={4} colorScheme="purple" rounded="full">Home</Button>
          </Link>
        </Flex>
      </>
    );
  }

  return (
    <Fragment>
      {/* add stuff to head */}
      <Head>
        <title>Gallery</title>
      </Head>
      <Center mt={4}>
        <Heading>Gallery</Heading>
      </Center>
      <Box>
        <GalleryBreadcrumb directoryPath={props.currentDirectoryPath} />
      </Box>

      {/* show message if nothing to display */}
      {!hasFolders && !hasImages ? <Flex h="xl" alignItems="center" justifyContent="center" flexDirection="column">
        <Heading as="h2" size="lg" color="gray.400">Nothing to show here</Heading>
        <Link href="/">
          <Button mt={4} colorScheme="purple" rounded="full">Home</Button>
        </Link>
      </Flex> : null}

      {/* align items in a grid */}
      <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }} m={4} gap={6}>
        {/* list all folders first */}
        {hasFolders ?
          props.directories.map((dir, idx) => (
            <FolderGridItem key={idx} directoryPath={dir} currentDirectoryPath={props.currentDirectoryPath} />
          )) : null}
        {hasImages ?
          props.images.map((image, idx) => {
            // check if previous image exists
            let previousImageName: string;
            if (idx > 0) {
              previousImageName = props.images[idx - 1];
            }
            // check if next image exists
            let nextImageName: string;
            if (idx !== props.images.length - 1) {
              nextImageName = props.images[idx + 1];
            }
            return (
              <ImageGridItem key={idx} directoryPath={props.currentDirectoryPath} imageName={image} previousImageName={previousImageName} nextImageName={nextImageName} />
            );
          })
          : null}
      </Grid>
    </Fragment >
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // get path of the directory to list from query
  let { directoryPath } = context.query;
  if (!directoryPath) {
    directoryPath = '/';
  }
  // request directories and images in folder
  const res = await fetch('http://localhost:3000/api/listDirectory', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      directoryPath: directoryPath,
    }),
  });
  if (res.status === 200) {
    // get JSON from body
    const resData = await res.json();
    // add the current path to the resData
    resData.currentDirectoryPath = directoryPath;
    return {
      props: resData,
    }
  }
  return {
    props: {
      error: 'server_error',
    }
  }
}
