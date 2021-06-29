import * as CryptoJS from "crypto-js";

class Block {
	static calculateBlockHash = (
		index: number,
		previouseHash: string,
		timestamp: number,
		data: string
	): string =>
		CryptoJS.SHA256(index + previouseHash + timestamp + data).toString();

	static validateStructure = (aBlock: Block): boolean =>
		typeof aBlock.index === "number" &&
		typeof aBlock.hash === "string" &&
		typeof aBlock.previouseHash === "string" &&
		typeof aBlock.timestamp === "number" &&
		typeof aBlock.data === "string";

	public index: number;
	public hash: string;
	public previouseHash: string;
	public data: string;
	public timestamp: number;

	constructor(
		index: number,
		hash: string,
		previouseHash: string,
		data: string,
		timestamp: number
	) {
		this.index = index;
		this.hash = hash;
		this.previouseHash = previouseHash;
		this.data = data;
		this.timestamp = timestamp;
	}
}

const genesisBlock: Block = new Block(0, "12123232", "", "hello", 123455);

let blockchain: Block[] = [genesisBlock];

const getBlockchain = (): Block[] => blockchain;

const getLatestBlock = (): Block => blockchain[blockchain.length - 1];

const getNewTimeStamp = (): number => Math.round(new Date().getTime() / 1000);

const createNewBlock = (data: string): Block => {
	const previouseBlock: Block = getLatestBlock();
	const newIndex: number = previouseBlock.index + 1;
	const newTimestamp: number = getNewTimeStamp();
	const newHash: string = Block.calculateBlockHash(
		newIndex,
		previouseBlock.hash,
		newTimestamp,
		data
	);
	const newBlock: Block = new Block(
		newIndex,
		newHash,
		previouseBlock.hash,
		data,
		newTimestamp
	);
	addBlock(newBlock);
	return newBlock;
};

const getHashforBlock = (aBlock: Block): string =>
	Block.calculateBlockHash(
		aBlock.index,
		aBlock.previouseHash,
		aBlock.timestamp,
		aBlock.data
	);

const isBlockValid = (
	candidateBlock: Block,
	previouseBlock: Block
): boolean => {
	if (!Block.validateStructure(candidateBlock)) {
		return false;
	} else if (previouseBlock.index + 1 !== candidateBlock.index) {
		return false;
	} else if (previouseBlock.hash !== candidateBlock.previouseHash) {
		return false;
	} else if (candidateBlock.hash !== getHashforBlock(candidateBlock)) {
		return false;
	} else {
		return true;
	}
};

const addBlock = (candidateBlock: Block): void => {
	if (isBlockValid(candidateBlock, getLatestBlock())) {
		blockchain.push(candidateBlock);
	}
};
createNewBlock("second block");
createNewBlock("third block");
createNewBlock("fourth block");
console.log(blockchain);
export {};
