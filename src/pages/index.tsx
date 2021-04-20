import { useEffect } from "react";

export default function Home(props) {
  console.log(props.episodes);

  return <h1>Index</h1>;
}

//SSR - Executado toda Vez que alguém acessar
// export async function getServerSideProps() {
//   const response = await fetch("http://localhost:3333/episodes");
//   const data = await response.json();

//   return {
//     props: {
//       episodes: data,
//     },
//   };
// }

//SSG - Static Site Generation
//Não gera uma requisição para a api toda vez
export async function getStaticProps() {
  const response = await fetch("http://localhost:3333/episodes");
  const data = await response.json();

  return {
    props: {
      episodes: data,
    },
    revalidate: 60 * 60 * 8,
  };
}
