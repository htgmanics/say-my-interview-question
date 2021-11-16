import sanityClient from '@sanity/client';

export default sanityClient({
	projectId: "h2dp1ejt",    
	dataset: 'production',
	useCdn: false
});
