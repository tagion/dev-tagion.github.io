import fs from 'fs';
import Head from 'next/head';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';
import rehypeSlug from 'rehype-slug';
import { v4 as uuid } from 'uuid';

import { HeadSEO, Highlighted } from 'ui/organisms';
import { ArticleImage, Navigation } from 'ui/molecules';
import { Link } from 'ui/atoms';

import posts from 'lib/content/blog/posts';

const Anchor = ({ id, children }) => <h4 id={id}>{children}</h4>;

const components = {
	Anchor,
};

const Post = ({ post }) => {
	return (
		<>
			<HeadSEO title={`${post.title} | Tagion Blog`} description={post.description} />
			{/*
			 * TODO:
			 * Add shorten SEO description
			 * Add SEO Keywords
			 * Add author and date
			 * Add links:
			 * - <meta property="og:url" content={location.href}></meta>
			 * - <link rel="canonical" href="https://blog.ethereum.org/2022/04/14/secured-no-3/"></link>
			 * Add link to image (<meta property="og:image" content="https://blog.ethereum.org/img/ethereum-blog-og-image.png">)
			 * Add twitter links
			 */}
			<Highlighted
				title={post.title}
				backLink='/blog'
				className='border-bottom-0'
				isSidebarFixed
				sidebarChildren={
					post.navigation.length ? (
						<Navigation>
							{post.navigation.map(({ title, id }) => (
								<Link href={`#${id}`} key={uuid()}>
									{title}
								</Link>
							))}
						</Navigation>
					) : null
				}
			>
				<ArticleImage imageSrc={post.image} />
				<MDXRemote {...post.content} components={components} />
			</Highlighted>
		</>
	);
};

export async function getStaticPaths() {
	const paths = posts.map((post) => ({
		params: { slug: post.slug },
	}));

	return {
		paths,
		fallback: false,
	};
}

export async function getStaticProps({ params, req }) {
	const { slug } = params;
	const post = posts.find((p) => p.slug === slug);

	const source = fs.readFileSync(`src/lib/content/blog/${slug}.mdx`, 'utf-8');
	const content = await serialize(source, { mdxOptions: { rehypePlugins: [rehypeSlug] } });

	return {
		props: { post: { ...post, content } },
	};
}

export default Post;
