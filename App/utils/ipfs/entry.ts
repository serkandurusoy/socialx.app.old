import config from '../../config/ipfs';
import ipfsAPI from '../../lib/ipfs';

const ipfs = new ipfsAPI({ host: config.ipfs_server, port: config.ipfs_port });

export default ipfs;