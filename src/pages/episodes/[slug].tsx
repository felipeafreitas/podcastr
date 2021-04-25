import React from "react";
import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { useRouter } from "next/router";
import { GetStaticProps, GetStaticPaths } from "next";
import { api } from "../../services/api";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";
import Link from "next/link";

import styles from "./episode.module.scss";
import Image from "next/image";

type Episode = {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  duration: number;
  durationString: string;
  members: string;
  publishedAt: string;
};

type EpisodeProps = {
  episode: Episode;
};

function Episode({ episode }: EpisodeProps) {
  // const router = useRouter();
  return (
    <div className={styles.episode}>
      {episode.title}
      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>
        <Image width={700} height={160} src={episode.thumbnail} />
        <button type="button">
          <img src="/play.svg" alt="Tocar episódio" />
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationString}</span>
      </header>

      <div
        className={styles.descriptio}
        dangerouslySetInnerHTML={{ __html: episode.description }}
      ></div>
    </div>
  );
}

export default Episode;

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking", //melhor para SEO: as infos são carregadas no servidos NextJS. Existe também as opções true e false
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params;

  const { data } = await api.get(`/episodes/${slug}`);

  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), "d MMMM yy", {
      locale: ptBR,
    }),
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    description: data.description,
    url: data.file.url,
  };

  return {
    props: { episode },
    revalidate: 60 * 60 * 24, //25 horas
  };
};
