export const load = async ({ params }: { params: { token: string } }) => {
	const { token } = params;
	console.log(token);
};
