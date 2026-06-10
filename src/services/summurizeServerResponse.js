export default async function summurizeServerResponse(...promises) {
    const responses = await Promise.all(promises);
    const isError = responses.some(resp => resp.status === 'error');

    return isError ? 'error' : 'ok';
}