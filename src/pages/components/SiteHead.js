import Head from "next/head";
import { useState } from "react";

export default function SiteHead(props) {
    return (
        <Head>
            <title>{props.children}</title>
            <meta name="description" content="L'Assiette Mijotée" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
    )
}
