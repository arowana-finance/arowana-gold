import { AddressLike, BaseContract, BigNumberish, BytesLike, ContractDeployTransaction, ContractFactory, ContractMethod, ContractRunner, ContractTransaction, ContractTransactionResponse, DeferredTopicFilter, EventFragment, EventLog, FunctionFragment, Interface, Listener, LogDescription, Provider, Result, Signer, TransactionRequest, Typed } from 'ethers';
import { SignerWithAddress } from 'ethers-opt';

export interface TypedDeferredTopicFilter<_TCEvent extends TypedContractEvent> extends DeferredTopicFilter {
}
export interface TypedContractEvent<InputTuple extends Array<any> = any, OutputTuple extends Array<any> = any, OutputObject = any> {
	(...args: Partial<InputTuple>): TypedDeferredTopicFilter<TypedContractEvent<InputTuple, OutputTuple, OutputObject>>;
	name: string;
	fragment: EventFragment;
	getFragment(...args: Partial<InputTuple>): EventFragment;
}
export type __TypechainAOutputTuple<T> = T extends TypedContractEvent<infer _U, infer W> ? W : never;
export type __TypechainOutputObject<T> = T extends TypedContractEvent<infer _U, infer _W, infer V> ? V : never;
export interface TypedEventLog<TCEvent extends TypedContractEvent> extends Omit<EventLog, "args"> {
	args: __TypechainAOutputTuple<TCEvent> & __TypechainOutputObject<TCEvent>;
}
export interface TypedLogDescription<TCEvent extends TypedContractEvent> extends Omit<LogDescription, "args"> {
	args: __TypechainAOutputTuple<TCEvent> & __TypechainOutputObject<TCEvent>;
}
export type TypedListener<TCEvent extends TypedContractEvent> = (...listenerArg: [
	...__TypechainAOutputTuple<TCEvent>,
	TypedEventLog<TCEvent>,
	...undefined[]
]) => void;
export type StateMutability = "nonpayable" | "payable" | "view";
export type BaseOverrides = Omit<TransactionRequest, "to" | "data">;
export type NonPayableOverrides = Omit<BaseOverrides, "value" | "blockTag" | "enableCcipRead">;
export type PayableOverrides = Omit<BaseOverrides, "blockTag" | "enableCcipRead">;
export type ViewOverrides = Omit<TransactionRequest, "to" | "data">;
export type Overrides<S extends StateMutability> = S extends "nonpayable" ? NonPayableOverrides : S extends "payable" ? PayableOverrides : ViewOverrides;
export type PostfixOverrides<A extends Array<any>, S extends StateMutability> = A | [
	...A,
	Overrides<S>
];
export type ContractMethodArgs<A extends Array<any>, S extends StateMutability> = PostfixOverrides<{
	[I in keyof A]-?: A[I] | Typed;
}, S>;
export type DefaultReturnType<R> = R extends Array<any> ? R[0] : R;
export interface TypedContractMethod<A extends Array<any> = Array<any>, R = any, S extends StateMutability = "payable"> {
	(...args: ContractMethodArgs<A, S>): S extends "view" ? Promise<DefaultReturnType<R>> : Promise<ContractTransactionResponse>;
	name: string;
	fragment: FunctionFragment;
	getFragment(...args: ContractMethodArgs<A, S>): FunctionFragment;
	populateTransaction(...args: ContractMethodArgs<A, S>): Promise<ContractTransaction>;
	staticCall(...args: ContractMethodArgs<A, "view">): Promise<DefaultReturnType<R>>;
	send(...args: ContractMethodArgs<A, S>): Promise<ContractTransactionResponse>;
	estimateGas(...args: ContractMethodArgs<A, S>): Promise<bigint>;
	staticCallResult(...args: ContractMethodArgs<A, "view">): Promise<R>;
}
export interface OwnableInterface extends Interface {
	getFunction(nameOrSignature: "owner" | "renounceOwnership" | "transferOwnership"): FunctionFragment;
	getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
	encodeFunctionData(functionFragment: "owner", values?: undefined): string;
	encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
	encodeFunctionData(functionFragment: "transferOwnership", values: [
		AddressLike
	]): string;
	decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
}
declare namespace OwnershipTransferredEvent {
	type InputTuple = [
		previousOwner: AddressLike,
		newOwner: AddressLike
	];
	type OutputTuple = [
		previousOwner: string,
		newOwner: string
	];
	interface OutputObject {
		previousOwner: string;
		newOwner: string;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
export interface Ownable extends BaseContract {
	connect(runner?: ContractRunner | null): Ownable;
	waitForDeployment(): Promise<this>;
	interface: OwnableInterface;
	queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
	listeners(eventName?: string): Promise<Array<Listener>>;
	removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
	owner: TypedContractMethod<[
	], [
		string
	], "view">;
	renounceOwnership: TypedContractMethod<[
	], [
		void
	], "nonpayable">;
	transferOwnership: TypedContractMethod<[
		newOwner: AddressLike
	], [
		void
	], "nonpayable">;
	getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
	getFunction(nameOrSignature: "owner"): TypedContractMethod<[
	], [
		string
	], "view">;
	getFunction(nameOrSignature: "renounceOwnership"): TypedContractMethod<[
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "transferOwnership"): TypedContractMethod<[
		newOwner: AddressLike
	], [
		void
	], "nonpayable">;
	getEvent(key: "OwnershipTransferred"): TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
	filters: {
		"OwnershipTransferred(address,address)": TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
		OwnershipTransferred: TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
	};
}
export interface IERC1363Interface extends Interface {
	getFunction(nameOrSignature: "allowance" | "approve" | "approveAndCall(address,uint256)" | "approveAndCall(address,uint256,bytes)" | "balanceOf" | "supportsInterface" | "totalSupply" | "transfer" | "transferAndCall(address,uint256)" | "transferAndCall(address,uint256,bytes)" | "transferFrom" | "transferFromAndCall(address,address,uint256,bytes)" | "transferFromAndCall(address,address,uint256)"): FunctionFragment;
	getEvent(nameOrSignatureOrTopic: "Approval" | "Transfer"): EventFragment;
	encodeFunctionData(functionFragment: "allowance", values: [
		AddressLike,
		AddressLike
	]): string;
	encodeFunctionData(functionFragment: "approve", values: [
		AddressLike,
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "approveAndCall(address,uint256)", values: [
		AddressLike,
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "approveAndCall(address,uint256,bytes)", values: [
		AddressLike,
		BigNumberish,
		BytesLike
	]): string;
	encodeFunctionData(functionFragment: "balanceOf", values: [
		AddressLike
	]): string;
	encodeFunctionData(functionFragment: "supportsInterface", values: [
		BytesLike
	]): string;
	encodeFunctionData(functionFragment: "totalSupply", values?: undefined): string;
	encodeFunctionData(functionFragment: "transfer", values: [
		AddressLike,
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "transferAndCall(address,uint256)", values: [
		AddressLike,
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "transferAndCall(address,uint256,bytes)", values: [
		AddressLike,
		BigNumberish,
		BytesLike
	]): string;
	encodeFunctionData(functionFragment: "transferFrom", values: [
		AddressLike,
		AddressLike,
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "transferFromAndCall(address,address,uint256,bytes)", values: [
		AddressLike,
		AddressLike,
		BigNumberish,
		BytesLike
	]): string;
	encodeFunctionData(functionFragment: "transferFromAndCall(address,address,uint256)", values: [
		AddressLike,
		AddressLike,
		BigNumberish
	]): string;
	decodeFunctionResult(functionFragment: "allowance", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "approveAndCall(address,uint256)", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "approveAndCall(address,uint256,bytes)", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "supportsInterface", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "totalSupply", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "transfer", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "transferAndCall(address,uint256)", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "transferAndCall(address,uint256,bytes)", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "transferFrom", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "transferFromAndCall(address,address,uint256,bytes)", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "transferFromAndCall(address,address,uint256)", data: BytesLike): Result;
}
declare namespace ApprovalEvent {
	type InputTuple = [
		owner: AddressLike,
		spender: AddressLike,
		value: BigNumberish
	];
	type OutputTuple = [
		owner: string,
		spender: string,
		value: bigint
	];
	interface OutputObject {
		owner: string;
		spender: string;
		value: bigint;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
declare namespace TransferEvent {
	type InputTuple = [
		from: AddressLike,
		to: AddressLike,
		value: BigNumberish
	];
	type OutputTuple = [
		from: string,
		to: string,
		value: bigint
	];
	interface OutputObject {
		from: string;
		to: string;
		value: bigint;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
export interface IERC1363 extends BaseContract {
	connect(runner?: ContractRunner | null): IERC1363;
	waitForDeployment(): Promise<this>;
	interface: IERC1363Interface;
	queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
	listeners(eventName?: string): Promise<Array<Listener>>;
	removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
	allowance: TypedContractMethod<[
		owner: AddressLike,
		spender: AddressLike
	], [
		bigint
	], "view">;
	approve: TypedContractMethod<[
		spender: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	"approveAndCall(address,uint256)": TypedContractMethod<[
		spender: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	"approveAndCall(address,uint256,bytes)": TypedContractMethod<[
		spender: AddressLike,
		value: BigNumberish,
		data: BytesLike
	], [
		boolean
	], "nonpayable">;
	balanceOf: TypedContractMethod<[
		account: AddressLike
	], [
		bigint
	], "view">;
	supportsInterface: TypedContractMethod<[
		interfaceId: BytesLike
	], [
		boolean
	], "view">;
	totalSupply: TypedContractMethod<[
	], [
		bigint
	], "view">;
	transfer: TypedContractMethod<[
		to: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	"transferAndCall(address,uint256)": TypedContractMethod<[
		to: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	"transferAndCall(address,uint256,bytes)": TypedContractMethod<[
		to: AddressLike,
		value: BigNumberish,
		data: BytesLike
	], [
		boolean
	], "nonpayable">;
	transferFrom: TypedContractMethod<[
		from: AddressLike,
		to: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	"transferFromAndCall(address,address,uint256,bytes)": TypedContractMethod<[
		from: AddressLike,
		to: AddressLike,
		value: BigNumberish,
		data: BytesLike
	], [
		boolean
	], "nonpayable">;
	"transferFromAndCall(address,address,uint256)": TypedContractMethod<[
		from: AddressLike,
		to: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
	getFunction(nameOrSignature: "allowance"): TypedContractMethod<[
		owner: AddressLike,
		spender: AddressLike
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "approve"): TypedContractMethod<[
		spender: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	getFunction(nameOrSignature: "approveAndCall(address,uint256)"): TypedContractMethod<[
		spender: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	getFunction(nameOrSignature: "approveAndCall(address,uint256,bytes)"): TypedContractMethod<[
		spender: AddressLike,
		value: BigNumberish,
		data: BytesLike
	], [
		boolean
	], "nonpayable">;
	getFunction(nameOrSignature: "balanceOf"): TypedContractMethod<[
		account: AddressLike
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "supportsInterface"): TypedContractMethod<[
		interfaceId: BytesLike
	], [
		boolean
	], "view">;
	getFunction(nameOrSignature: "totalSupply"): TypedContractMethod<[
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "transfer"): TypedContractMethod<[
		to: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	getFunction(nameOrSignature: "transferAndCall(address,uint256)"): TypedContractMethod<[
		to: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	getFunction(nameOrSignature: "transferAndCall(address,uint256,bytes)"): TypedContractMethod<[
		to: AddressLike,
		value: BigNumberish,
		data: BytesLike
	], [
		boolean
	], "nonpayable">;
	getFunction(nameOrSignature: "transferFrom"): TypedContractMethod<[
		from: AddressLike,
		to: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	getFunction(nameOrSignature: "transferFromAndCall(address,address,uint256,bytes)"): TypedContractMethod<[
		from: AddressLike,
		to: AddressLike,
		value: BigNumberish,
		data: BytesLike
	], [
		boolean
	], "nonpayable">;
	getFunction(nameOrSignature: "transferFromAndCall(address,address,uint256)"): TypedContractMethod<[
		from: AddressLike,
		to: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	getEvent(key: "Approval"): TypedContractEvent<ApprovalEvent.InputTuple, ApprovalEvent.OutputTuple, ApprovalEvent.OutputObject>;
	getEvent(key: "Transfer"): TypedContractEvent<TransferEvent.InputTuple, TransferEvent.OutputTuple, TransferEvent.OutputObject>;
	filters: {
		"Approval(address,address,uint256)": TypedContractEvent<ApprovalEvent.InputTuple, ApprovalEvent.OutputTuple, ApprovalEvent.OutputObject>;
		Approval: TypedContractEvent<ApprovalEvent.InputTuple, ApprovalEvent.OutputTuple, ApprovalEvent.OutputObject>;
		"Transfer(address,address,uint256)": TypedContractEvent<TransferEvent.InputTuple, TransferEvent.OutputTuple, TransferEvent.OutputObject>;
		Transfer: TypedContractEvent<TransferEvent.InputTuple, TransferEvent.OutputTuple, TransferEvent.OutputObject>;
	};
}
export interface IERC1967Interface extends Interface {
	getEvent(nameOrSignatureOrTopic: "AdminChanged" | "BeaconUpgraded" | "Upgraded"): EventFragment;
}
declare namespace AdminChangedEvent {
	type InputTuple = [
		previousAdmin: AddressLike,
		newAdmin: AddressLike
	];
	type OutputTuple = [
		previousAdmin: string,
		newAdmin: string
	];
	interface OutputObject {
		previousAdmin: string;
		newAdmin: string;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
declare namespace BeaconUpgradedEvent {
	type InputTuple = [
		beacon: AddressLike
	];
	type OutputTuple = [
		beacon: string
	];
	interface OutputObject {
		beacon: string;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
declare namespace UpgradedEvent {
	type InputTuple = [
		implementation: AddressLike
	];
	type OutputTuple = [
		implementation: string
	];
	interface OutputObject {
		implementation: string;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
export interface IERC1967 extends BaseContract {
	connect(runner?: ContractRunner | null): IERC1967;
	waitForDeployment(): Promise<this>;
	interface: IERC1967Interface;
	queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
	listeners(eventName?: string): Promise<Array<Listener>>;
	removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
	getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
	getEvent(key: "AdminChanged"): TypedContractEvent<AdminChangedEvent.InputTuple, AdminChangedEvent.OutputTuple, AdminChangedEvent.OutputObject>;
	getEvent(key: "BeaconUpgraded"): TypedContractEvent<BeaconUpgradedEvent.InputTuple, BeaconUpgradedEvent.OutputTuple, BeaconUpgradedEvent.OutputObject>;
	getEvent(key: "Upgraded"): TypedContractEvent<UpgradedEvent.InputTuple, UpgradedEvent.OutputTuple, UpgradedEvent.OutputObject>;
	filters: {
		"AdminChanged(address,address)": TypedContractEvent<AdminChangedEvent.InputTuple, AdminChangedEvent.OutputTuple, AdminChangedEvent.OutputObject>;
		AdminChanged: TypedContractEvent<AdminChangedEvent.InputTuple, AdminChangedEvent.OutputTuple, AdminChangedEvent.OutputObject>;
		"BeaconUpgraded(address)": TypedContractEvent<BeaconUpgradedEvent.InputTuple, BeaconUpgradedEvent.OutputTuple, BeaconUpgradedEvent.OutputObject>;
		BeaconUpgraded: TypedContractEvent<BeaconUpgradedEvent.InputTuple, BeaconUpgradedEvent.OutputTuple, BeaconUpgradedEvent.OutputObject>;
		"Upgraded(address)": TypedContractEvent<UpgradedEvent.InputTuple, UpgradedEvent.OutputTuple, UpgradedEvent.OutputObject>;
		Upgraded: TypedContractEvent<UpgradedEvent.InputTuple, UpgradedEvent.OutputTuple, UpgradedEvent.OutputObject>;
	};
}
export interface IERC5267Interface extends Interface {
	getFunction(nameOrSignature: "eip712Domain"): FunctionFragment;
	getEvent(nameOrSignatureOrTopic: "EIP712DomainChanged"): EventFragment;
	encodeFunctionData(functionFragment: "eip712Domain", values?: undefined): string;
	decodeFunctionResult(functionFragment: "eip712Domain", data: BytesLike): Result;
}
declare namespace EIP712DomainChangedEvent {
	type InputTuple = [
	];
	type OutputTuple = [
	];
	interface OutputObject {
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
export interface IERC5267 extends BaseContract {
	connect(runner?: ContractRunner | null): IERC5267;
	waitForDeployment(): Promise<this>;
	interface: IERC5267Interface;
	queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
	listeners(eventName?: string): Promise<Array<Listener>>;
	removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
	eip712Domain: TypedContractMethod<[
	], [
		[
			string,
			string,
			string,
			bigint,
			string,
			string,
			bigint[]
		] & {
			fields: string;
			name: string;
			version: string;
			chainId: bigint;
			verifyingContract: string;
			salt: string;
			extensions: bigint[];
		}
	], "view">;
	getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
	getFunction(nameOrSignature: "eip712Domain"): TypedContractMethod<[
	], [
		[
			string,
			string,
			string,
			bigint,
			string,
			string,
			bigint[]
		] & {
			fields: string;
			name: string;
			version: string;
			chainId: bigint;
			verifyingContract: string;
			salt: string;
			extensions: bigint[];
		}
	], "view">;
	getEvent(key: "EIP712DomainChanged"): TypedContractEvent<EIP712DomainChangedEvent.InputTuple, EIP712DomainChangedEvent.OutputTuple, EIP712DomainChangedEvent.OutputObject>;
	filters: {
		"EIP712DomainChanged()": TypedContractEvent<EIP712DomainChangedEvent.InputTuple, EIP712DomainChangedEvent.OutputTuple, EIP712DomainChangedEvent.OutputObject>;
		EIP712DomainChanged: TypedContractEvent<EIP712DomainChangedEvent.InputTuple, EIP712DomainChangedEvent.OutputTuple, EIP712DomainChangedEvent.OutputObject>;
	};
}
export interface IERC1155ErrorsInterface extends Interface {
}
export interface IERC1155Errors extends BaseContract {
	connect(runner?: ContractRunner | null): IERC1155Errors;
	waitForDeployment(): Promise<this>;
	interface: IERC1155ErrorsInterface;
	queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
	listeners(eventName?: string): Promise<Array<Listener>>;
	removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
	getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
	filters: {};
}
export interface IERC20ErrorsInterface extends Interface {
}
export interface IERC20Errors extends BaseContract {
	connect(runner?: ContractRunner | null): IERC20Errors;
	waitForDeployment(): Promise<this>;
	interface: IERC20ErrorsInterface;
	queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
	listeners(eventName?: string): Promise<Array<Listener>>;
	removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
	getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
	filters: {};
}
export interface IERC721ErrorsInterface extends Interface {
}
export interface IERC721Errors extends BaseContract {
	connect(runner?: ContractRunner | null): IERC721Errors;
	waitForDeployment(): Promise<this>;
	interface: IERC721ErrorsInterface;
	queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
	listeners(eventName?: string): Promise<Array<Listener>>;
	removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
	getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
	filters: {};
}
export interface ERC1967UtilsInterface extends Interface {
}
export interface ERC1967Utils extends BaseContract {
	connect(runner?: ContractRunner | null): ERC1967Utils;
	waitForDeployment(): Promise<this>;
	interface: ERC1967UtilsInterface;
	queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
	listeners(eventName?: string): Promise<Array<Listener>>;
	removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
	getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
	filters: {};
}
export interface ProxyInterface extends Interface {
}
interface Proxy$1 extends BaseContract {
	connect(runner?: ContractRunner | null): Proxy$1;
	waitForDeployment(): Promise<this>;
	interface: ProxyInterface;
	queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
	listeners(eventName?: string): Promise<Array<Listener>>;
	removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
	getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
	filters: {};
}
export interface IBeaconInterface extends Interface {
	getFunction(nameOrSignature: "implementation"): FunctionFragment;
	encodeFunctionData(functionFragment: "implementation", values?: undefined): string;
	decodeFunctionResult(functionFragment: "implementation", data: BytesLike): Result;
}
export interface IBeacon extends BaseContract {
	connect(runner?: ContractRunner | null): IBeacon;
	waitForDeployment(): Promise<this>;
	interface: IBeaconInterface;
	queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
	listeners(eventName?: string): Promise<Array<Listener>>;
	removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
	implementation: TypedContractMethod<[
	], [
		string
	], "view">;
	getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
	getFunction(nameOrSignature: "implementation"): TypedContractMethod<[
	], [
		string
	], "view">;
	filters: {};
}
export interface ERC20Interface extends Interface {
	getFunction(nameOrSignature: "allowance" | "approve" | "balanceOf" | "decimals" | "name" | "symbol" | "totalSupply" | "transfer" | "transferFrom"): FunctionFragment;
	getEvent(nameOrSignatureOrTopic: "Approval" | "Transfer"): EventFragment;
	encodeFunctionData(functionFragment: "allowance", values: [
		AddressLike,
		AddressLike
	]): string;
	encodeFunctionData(functionFragment: "approve", values: [
		AddressLike,
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "balanceOf", values: [
		AddressLike
	]): string;
	encodeFunctionData(functionFragment: "decimals", values?: undefined): string;
	encodeFunctionData(functionFragment: "name", values?: undefined): string;
	encodeFunctionData(functionFragment: "symbol", values?: undefined): string;
	encodeFunctionData(functionFragment: "totalSupply", values?: undefined): string;
	encodeFunctionData(functionFragment: "transfer", values: [
		AddressLike,
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "transferFrom", values: [
		AddressLike,
		AddressLike,
		BigNumberish
	]): string;
	decodeFunctionResult(functionFragment: "allowance", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "decimals", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "symbol", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "totalSupply", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "transfer", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "transferFrom", data: BytesLike): Result;
}
declare namespace ApprovalEvent$1 {
	type InputTuple = [
		owner: AddressLike,
		spender: AddressLike,
		value: BigNumberish
	];
	type OutputTuple = [
		owner: string,
		spender: string,
		value: bigint
	];
	interface OutputObject {
		owner: string;
		spender: string;
		value: bigint;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
declare namespace TransferEvent$1 {
	type InputTuple = [
		from: AddressLike,
		to: AddressLike,
		value: BigNumberish
	];
	type OutputTuple = [
		from: string,
		to: string,
		value: bigint
	];
	interface OutputObject {
		from: string;
		to: string;
		value: bigint;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
export interface ERC20 extends BaseContract {
	connect(runner?: ContractRunner | null): ERC20;
	waitForDeployment(): Promise<this>;
	interface: ERC20Interface;
	queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
	listeners(eventName?: string): Promise<Array<Listener>>;
	removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
	allowance: TypedContractMethod<[
		owner: AddressLike,
		spender: AddressLike
	], [
		bigint
	], "view">;
	approve: TypedContractMethod<[
		spender: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	balanceOf: TypedContractMethod<[
		account: AddressLike
	], [
		bigint
	], "view">;
	decimals: TypedContractMethod<[
	], [
		bigint
	], "view">;
	name: TypedContractMethod<[
	], [
		string
	], "view">;
	symbol: TypedContractMethod<[
	], [
		string
	], "view">;
	totalSupply: TypedContractMethod<[
	], [
		bigint
	], "view">;
	transfer: TypedContractMethod<[
		to: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	transferFrom: TypedContractMethod<[
		from: AddressLike,
		to: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
	getFunction(nameOrSignature: "allowance"): TypedContractMethod<[
		owner: AddressLike,
		spender: AddressLike
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "approve"): TypedContractMethod<[
		spender: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	getFunction(nameOrSignature: "balanceOf"): TypedContractMethod<[
		account: AddressLike
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "decimals"): TypedContractMethod<[
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "name"): TypedContractMethod<[
	], [
		string
	], "view">;
	getFunction(nameOrSignature: "symbol"): TypedContractMethod<[
	], [
		string
	], "view">;
	getFunction(nameOrSignature: "totalSupply"): TypedContractMethod<[
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "transfer"): TypedContractMethod<[
		to: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	getFunction(nameOrSignature: "transferFrom"): TypedContractMethod<[
		from: AddressLike,
		to: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	getEvent(key: "Approval"): TypedContractEvent<ApprovalEvent$1.InputTuple, ApprovalEvent$1.OutputTuple, ApprovalEvent$1.OutputObject>;
	getEvent(key: "Transfer"): TypedContractEvent<TransferEvent$1.InputTuple, TransferEvent$1.OutputTuple, TransferEvent$1.OutputObject>;
	filters: {
		"Approval(address,address,uint256)": TypedContractEvent<ApprovalEvent$1.InputTuple, ApprovalEvent$1.OutputTuple, ApprovalEvent$1.OutputObject>;
		Approval: TypedContractEvent<ApprovalEvent$1.InputTuple, ApprovalEvent$1.OutputTuple, ApprovalEvent$1.OutputObject>;
		"Transfer(address,address,uint256)": TypedContractEvent<TransferEvent$1.InputTuple, TransferEvent$1.OutputTuple, TransferEvent$1.OutputObject>;
		Transfer: TypedContractEvent<TransferEvent$1.InputTuple, TransferEvent$1.OutputTuple, TransferEvent$1.OutputObject>;
	};
}
export interface IERC20Interface extends Interface {
	getFunction(nameOrSignature: "allowance" | "approve" | "balanceOf" | "totalSupply" | "transfer" | "transferFrom"): FunctionFragment;
	getEvent(nameOrSignatureOrTopic: "Approval" | "Transfer"): EventFragment;
	encodeFunctionData(functionFragment: "allowance", values: [
		AddressLike,
		AddressLike
	]): string;
	encodeFunctionData(functionFragment: "approve", values: [
		AddressLike,
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "balanceOf", values: [
		AddressLike
	]): string;
	encodeFunctionData(functionFragment: "totalSupply", values?: undefined): string;
	encodeFunctionData(functionFragment: "transfer", values: [
		AddressLike,
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "transferFrom", values: [
		AddressLike,
		AddressLike,
		BigNumberish
	]): string;
	decodeFunctionResult(functionFragment: "allowance", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "totalSupply", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "transfer", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "transferFrom", data: BytesLike): Result;
}
declare namespace ApprovalEvent$2 {
	type InputTuple = [
		owner: AddressLike,
		spender: AddressLike,
		value: BigNumberish
	];
	type OutputTuple = [
		owner: string,
		spender: string,
		value: bigint
	];
	interface OutputObject {
		owner: string;
		spender: string;
		value: bigint;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
declare namespace TransferEvent$2 {
	type InputTuple = [
		from: AddressLike,
		to: AddressLike,
		value: BigNumberish
	];
	type OutputTuple = [
		from: string,
		to: string,
		value: bigint
	];
	interface OutputObject {
		from: string;
		to: string;
		value: bigint;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
export interface IERC20 extends BaseContract {
	connect(runner?: ContractRunner | null): IERC20;
	waitForDeployment(): Promise<this>;
	interface: IERC20Interface;
	queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
	listeners(eventName?: string): Promise<Array<Listener>>;
	removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
	allowance: TypedContractMethod<[
		owner: AddressLike,
		spender: AddressLike
	], [
		bigint
	], "view">;
	approve: TypedContractMethod<[
		spender: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	balanceOf: TypedContractMethod<[
		account: AddressLike
	], [
		bigint
	], "view">;
	totalSupply: TypedContractMethod<[
	], [
		bigint
	], "view">;
	transfer: TypedContractMethod<[
		to: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	transferFrom: TypedContractMethod<[
		from: AddressLike,
		to: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
	getFunction(nameOrSignature: "allowance"): TypedContractMethod<[
		owner: AddressLike,
		spender: AddressLike
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "approve"): TypedContractMethod<[
		spender: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	getFunction(nameOrSignature: "balanceOf"): TypedContractMethod<[
		account: AddressLike
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "totalSupply"): TypedContractMethod<[
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "transfer"): TypedContractMethod<[
		to: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	getFunction(nameOrSignature: "transferFrom"): TypedContractMethod<[
		from: AddressLike,
		to: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	getEvent(key: "Approval"): TypedContractEvent<ApprovalEvent$2.InputTuple, ApprovalEvent$2.OutputTuple, ApprovalEvent$2.OutputObject>;
	getEvent(key: "Transfer"): TypedContractEvent<TransferEvent$2.InputTuple, TransferEvent$2.OutputTuple, TransferEvent$2.OutputObject>;
	filters: {
		"Approval(address,address,uint256)": TypedContractEvent<ApprovalEvent$2.InputTuple, ApprovalEvent$2.OutputTuple, ApprovalEvent$2.OutputObject>;
		Approval: TypedContractEvent<ApprovalEvent$2.InputTuple, ApprovalEvent$2.OutputTuple, ApprovalEvent$2.OutputObject>;
		"Transfer(address,address,uint256)": TypedContractEvent<TransferEvent$2.InputTuple, TransferEvent$2.OutputTuple, TransferEvent$2.OutputObject>;
		Transfer: TypedContractEvent<TransferEvent$2.InputTuple, TransferEvent$2.OutputTuple, TransferEvent$2.OutputObject>;
	};
}
export interface ERC20BurnableInterface extends Interface {
	getFunction(nameOrSignature: "allowance" | "approve" | "balanceOf" | "burn" | "burnFrom" | "decimals" | "name" | "symbol" | "totalSupply" | "transfer" | "transferFrom"): FunctionFragment;
	getEvent(nameOrSignatureOrTopic: "Approval" | "Transfer"): EventFragment;
	encodeFunctionData(functionFragment: "allowance", values: [
		AddressLike,
		AddressLike
	]): string;
	encodeFunctionData(functionFragment: "approve", values: [
		AddressLike,
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "balanceOf", values: [
		AddressLike
	]): string;
	encodeFunctionData(functionFragment: "burn", values: [
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "burnFrom", values: [
		AddressLike,
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "decimals", values?: undefined): string;
	encodeFunctionData(functionFragment: "name", values?: undefined): string;
	encodeFunctionData(functionFragment: "symbol", values?: undefined): string;
	encodeFunctionData(functionFragment: "totalSupply", values?: undefined): string;
	encodeFunctionData(functionFragment: "transfer", values: [
		AddressLike,
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "transferFrom", values: [
		AddressLike,
		AddressLike,
		BigNumberish
	]): string;
	decodeFunctionResult(functionFragment: "allowance", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "burn", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "burnFrom", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "decimals", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "symbol", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "totalSupply", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "transfer", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "transferFrom", data: BytesLike): Result;
}
declare namespace ApprovalEvent$3 {
	type InputTuple = [
		owner: AddressLike,
		spender: AddressLike,
		value: BigNumberish
	];
	type OutputTuple = [
		owner: string,
		spender: string,
		value: bigint
	];
	interface OutputObject {
		owner: string;
		spender: string;
		value: bigint;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
declare namespace TransferEvent$3 {
	type InputTuple = [
		from: AddressLike,
		to: AddressLike,
		value: BigNumberish
	];
	type OutputTuple = [
		from: string,
		to: string,
		value: bigint
	];
	interface OutputObject {
		from: string;
		to: string;
		value: bigint;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
export interface ERC20Burnable extends BaseContract {
	connect(runner?: ContractRunner | null): ERC20Burnable;
	waitForDeployment(): Promise<this>;
	interface: ERC20BurnableInterface;
	queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
	listeners(eventName?: string): Promise<Array<Listener>>;
	removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
	allowance: TypedContractMethod<[
		owner: AddressLike,
		spender: AddressLike
	], [
		bigint
	], "view">;
	approve: TypedContractMethod<[
		spender: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	balanceOf: TypedContractMethod<[
		account: AddressLike
	], [
		bigint
	], "view">;
	burn: TypedContractMethod<[
		value: BigNumberish
	], [
		void
	], "nonpayable">;
	burnFrom: TypedContractMethod<[
		account: AddressLike,
		value: BigNumberish
	], [
		void
	], "nonpayable">;
	decimals: TypedContractMethod<[
	], [
		bigint
	], "view">;
	name: TypedContractMethod<[
	], [
		string
	], "view">;
	symbol: TypedContractMethod<[
	], [
		string
	], "view">;
	totalSupply: TypedContractMethod<[
	], [
		bigint
	], "view">;
	transfer: TypedContractMethod<[
		to: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	transferFrom: TypedContractMethod<[
		from: AddressLike,
		to: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
	getFunction(nameOrSignature: "allowance"): TypedContractMethod<[
		owner: AddressLike,
		spender: AddressLike
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "approve"): TypedContractMethod<[
		spender: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	getFunction(nameOrSignature: "balanceOf"): TypedContractMethod<[
		account: AddressLike
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "burn"): TypedContractMethod<[
		value: BigNumberish
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "burnFrom"): TypedContractMethod<[
		account: AddressLike,
		value: BigNumberish
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "decimals"): TypedContractMethod<[
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "name"): TypedContractMethod<[
	], [
		string
	], "view">;
	getFunction(nameOrSignature: "symbol"): TypedContractMethod<[
	], [
		string
	], "view">;
	getFunction(nameOrSignature: "totalSupply"): TypedContractMethod<[
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "transfer"): TypedContractMethod<[
		to: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	getFunction(nameOrSignature: "transferFrom"): TypedContractMethod<[
		from: AddressLike,
		to: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	getEvent(key: "Approval"): TypedContractEvent<ApprovalEvent$3.InputTuple, ApprovalEvent$3.OutputTuple, ApprovalEvent$3.OutputObject>;
	getEvent(key: "Transfer"): TypedContractEvent<TransferEvent$3.InputTuple, TransferEvent$3.OutputTuple, TransferEvent$3.OutputObject>;
	filters: {
		"Approval(address,address,uint256)": TypedContractEvent<ApprovalEvent$3.InputTuple, ApprovalEvent$3.OutputTuple, ApprovalEvent$3.OutputObject>;
		Approval: TypedContractEvent<ApprovalEvent$3.InputTuple, ApprovalEvent$3.OutputTuple, ApprovalEvent$3.OutputObject>;
		"Transfer(address,address,uint256)": TypedContractEvent<TransferEvent$3.InputTuple, TransferEvent$3.OutputTuple, TransferEvent$3.OutputObject>;
		Transfer: TypedContractEvent<TransferEvent$3.InputTuple, TransferEvent$3.OutputTuple, TransferEvent$3.OutputObject>;
	};
}
export interface ERC20PermitInterface extends Interface {
	getFunction(nameOrSignature: "DOMAIN_SEPARATOR" | "allowance" | "approve" | "balanceOf" | "decimals" | "eip712Domain" | "name" | "nonces" | "permit" | "symbol" | "totalSupply" | "transfer" | "transferFrom"): FunctionFragment;
	getEvent(nameOrSignatureOrTopic: "Approval" | "EIP712DomainChanged" | "Transfer"): EventFragment;
	encodeFunctionData(functionFragment: "DOMAIN_SEPARATOR", values?: undefined): string;
	encodeFunctionData(functionFragment: "allowance", values: [
		AddressLike,
		AddressLike
	]): string;
	encodeFunctionData(functionFragment: "approve", values: [
		AddressLike,
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "balanceOf", values: [
		AddressLike
	]): string;
	encodeFunctionData(functionFragment: "decimals", values?: undefined): string;
	encodeFunctionData(functionFragment: "eip712Domain", values?: undefined): string;
	encodeFunctionData(functionFragment: "name", values?: undefined): string;
	encodeFunctionData(functionFragment: "nonces", values: [
		AddressLike
	]): string;
	encodeFunctionData(functionFragment: "permit", values: [
		AddressLike,
		AddressLike,
		BigNumberish,
		BigNumberish,
		BigNumberish,
		BytesLike,
		BytesLike
	]): string;
	encodeFunctionData(functionFragment: "symbol", values?: undefined): string;
	encodeFunctionData(functionFragment: "totalSupply", values?: undefined): string;
	encodeFunctionData(functionFragment: "transfer", values: [
		AddressLike,
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "transferFrom", values: [
		AddressLike,
		AddressLike,
		BigNumberish
	]): string;
	decodeFunctionResult(functionFragment: "DOMAIN_SEPARATOR", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "allowance", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "decimals", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "eip712Domain", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "nonces", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "permit", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "symbol", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "totalSupply", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "transfer", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "transferFrom", data: BytesLike): Result;
}
declare namespace ApprovalEvent$4 {
	type InputTuple = [
		owner: AddressLike,
		spender: AddressLike,
		value: BigNumberish
	];
	type OutputTuple = [
		owner: string,
		spender: string,
		value: bigint
	];
	interface OutputObject {
		owner: string;
		spender: string;
		value: bigint;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
declare namespace EIP712DomainChangedEvent$1 {
	type InputTuple = [
	];
	type OutputTuple = [
	];
	interface OutputObject {
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
declare namespace TransferEvent$4 {
	type InputTuple = [
		from: AddressLike,
		to: AddressLike,
		value: BigNumberish
	];
	type OutputTuple = [
		from: string,
		to: string,
		value: bigint
	];
	interface OutputObject {
		from: string;
		to: string;
		value: bigint;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
export interface ERC20Permit extends BaseContract {
	connect(runner?: ContractRunner | null): ERC20Permit;
	waitForDeployment(): Promise<this>;
	interface: ERC20PermitInterface;
	queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
	listeners(eventName?: string): Promise<Array<Listener>>;
	removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
	DOMAIN_SEPARATOR: TypedContractMethod<[
	], [
		string
	], "view">;
	allowance: TypedContractMethod<[
		owner: AddressLike,
		spender: AddressLike
	], [
		bigint
	], "view">;
	approve: TypedContractMethod<[
		spender: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	balanceOf: TypedContractMethod<[
		account: AddressLike
	], [
		bigint
	], "view">;
	decimals: TypedContractMethod<[
	], [
		bigint
	], "view">;
	eip712Domain: TypedContractMethod<[
	], [
		[
			string,
			string,
			string,
			bigint,
			string,
			string,
			bigint[]
		] & {
			fields: string;
			name: string;
			version: string;
			chainId: bigint;
			verifyingContract: string;
			salt: string;
			extensions: bigint[];
		}
	], "view">;
	name: TypedContractMethod<[
	], [
		string
	], "view">;
	nonces: TypedContractMethod<[
		owner: AddressLike
	], [
		bigint
	], "view">;
	permit: TypedContractMethod<[
		owner: AddressLike,
		spender: AddressLike,
		value: BigNumberish,
		deadline: BigNumberish,
		v: BigNumberish,
		r: BytesLike,
		s: BytesLike
	], [
		void
	], "nonpayable">;
	symbol: TypedContractMethod<[
	], [
		string
	], "view">;
	totalSupply: TypedContractMethod<[
	], [
		bigint
	], "view">;
	transfer: TypedContractMethod<[
		to: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	transferFrom: TypedContractMethod<[
		from: AddressLike,
		to: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
	getFunction(nameOrSignature: "DOMAIN_SEPARATOR"): TypedContractMethod<[
	], [
		string
	], "view">;
	getFunction(nameOrSignature: "allowance"): TypedContractMethod<[
		owner: AddressLike,
		spender: AddressLike
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "approve"): TypedContractMethod<[
		spender: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	getFunction(nameOrSignature: "balanceOf"): TypedContractMethod<[
		account: AddressLike
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "decimals"): TypedContractMethod<[
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "eip712Domain"): TypedContractMethod<[
	], [
		[
			string,
			string,
			string,
			bigint,
			string,
			string,
			bigint[]
		] & {
			fields: string;
			name: string;
			version: string;
			chainId: bigint;
			verifyingContract: string;
			salt: string;
			extensions: bigint[];
		}
	], "view">;
	getFunction(nameOrSignature: "name"): TypedContractMethod<[
	], [
		string
	], "view">;
	getFunction(nameOrSignature: "nonces"): TypedContractMethod<[
		owner: AddressLike
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "permit"): TypedContractMethod<[
		owner: AddressLike,
		spender: AddressLike,
		value: BigNumberish,
		deadline: BigNumberish,
		v: BigNumberish,
		r: BytesLike,
		s: BytesLike
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "symbol"): TypedContractMethod<[
	], [
		string
	], "view">;
	getFunction(nameOrSignature: "totalSupply"): TypedContractMethod<[
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "transfer"): TypedContractMethod<[
		to: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	getFunction(nameOrSignature: "transferFrom"): TypedContractMethod<[
		from: AddressLike,
		to: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	getEvent(key: "Approval"): TypedContractEvent<ApprovalEvent$4.InputTuple, ApprovalEvent$4.OutputTuple, ApprovalEvent$4.OutputObject>;
	getEvent(key: "EIP712DomainChanged"): TypedContractEvent<EIP712DomainChangedEvent$1.InputTuple, EIP712DomainChangedEvent$1.OutputTuple, EIP712DomainChangedEvent$1.OutputObject>;
	getEvent(key: "Transfer"): TypedContractEvent<TransferEvent$4.InputTuple, TransferEvent$4.OutputTuple, TransferEvent$4.OutputObject>;
	filters: {
		"Approval(address,address,uint256)": TypedContractEvent<ApprovalEvent$4.InputTuple, ApprovalEvent$4.OutputTuple, ApprovalEvent$4.OutputObject>;
		Approval: TypedContractEvent<ApprovalEvent$4.InputTuple, ApprovalEvent$4.OutputTuple, ApprovalEvent$4.OutputObject>;
		"EIP712DomainChanged()": TypedContractEvent<EIP712DomainChangedEvent$1.InputTuple, EIP712DomainChangedEvent$1.OutputTuple, EIP712DomainChangedEvent$1.OutputObject>;
		EIP712DomainChanged: TypedContractEvent<EIP712DomainChangedEvent$1.InputTuple, EIP712DomainChangedEvent$1.OutputTuple, EIP712DomainChangedEvent$1.OutputObject>;
		"Transfer(address,address,uint256)": TypedContractEvent<TransferEvent$4.InputTuple, TransferEvent$4.OutputTuple, TransferEvent$4.OutputObject>;
		Transfer: TypedContractEvent<TransferEvent$4.InputTuple, TransferEvent$4.OutputTuple, TransferEvent$4.OutputObject>;
	};
}
export interface IERC20MetadataInterface extends Interface {
	getFunction(nameOrSignature: "allowance" | "approve" | "balanceOf" | "decimals" | "name" | "symbol" | "totalSupply" | "transfer" | "transferFrom"): FunctionFragment;
	getEvent(nameOrSignatureOrTopic: "Approval" | "Transfer"): EventFragment;
	encodeFunctionData(functionFragment: "allowance", values: [
		AddressLike,
		AddressLike
	]): string;
	encodeFunctionData(functionFragment: "approve", values: [
		AddressLike,
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "balanceOf", values: [
		AddressLike
	]): string;
	encodeFunctionData(functionFragment: "decimals", values?: undefined): string;
	encodeFunctionData(functionFragment: "name", values?: undefined): string;
	encodeFunctionData(functionFragment: "symbol", values?: undefined): string;
	encodeFunctionData(functionFragment: "totalSupply", values?: undefined): string;
	encodeFunctionData(functionFragment: "transfer", values: [
		AddressLike,
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "transferFrom", values: [
		AddressLike,
		AddressLike,
		BigNumberish
	]): string;
	decodeFunctionResult(functionFragment: "allowance", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "decimals", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "symbol", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "totalSupply", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "transfer", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "transferFrom", data: BytesLike): Result;
}
declare namespace ApprovalEvent$5 {
	type InputTuple = [
		owner: AddressLike,
		spender: AddressLike,
		value: BigNumberish
	];
	type OutputTuple = [
		owner: string,
		spender: string,
		value: bigint
	];
	interface OutputObject {
		owner: string;
		spender: string;
		value: bigint;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
declare namespace TransferEvent$5 {
	type InputTuple = [
		from: AddressLike,
		to: AddressLike,
		value: BigNumberish
	];
	type OutputTuple = [
		from: string,
		to: string,
		value: bigint
	];
	interface OutputObject {
		from: string;
		to: string;
		value: bigint;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
export interface IERC20Metadata extends BaseContract {
	connect(runner?: ContractRunner | null): IERC20Metadata;
	waitForDeployment(): Promise<this>;
	interface: IERC20MetadataInterface;
	queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
	listeners(eventName?: string): Promise<Array<Listener>>;
	removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
	allowance: TypedContractMethod<[
		owner: AddressLike,
		spender: AddressLike
	], [
		bigint
	], "view">;
	approve: TypedContractMethod<[
		spender: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	balanceOf: TypedContractMethod<[
		account: AddressLike
	], [
		bigint
	], "view">;
	decimals: TypedContractMethod<[
	], [
		bigint
	], "view">;
	name: TypedContractMethod<[
	], [
		string
	], "view">;
	symbol: TypedContractMethod<[
	], [
		string
	], "view">;
	totalSupply: TypedContractMethod<[
	], [
		bigint
	], "view">;
	transfer: TypedContractMethod<[
		to: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	transferFrom: TypedContractMethod<[
		from: AddressLike,
		to: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
	getFunction(nameOrSignature: "allowance"): TypedContractMethod<[
		owner: AddressLike,
		spender: AddressLike
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "approve"): TypedContractMethod<[
		spender: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	getFunction(nameOrSignature: "balanceOf"): TypedContractMethod<[
		account: AddressLike
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "decimals"): TypedContractMethod<[
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "name"): TypedContractMethod<[
	], [
		string
	], "view">;
	getFunction(nameOrSignature: "symbol"): TypedContractMethod<[
	], [
		string
	], "view">;
	getFunction(nameOrSignature: "totalSupply"): TypedContractMethod<[
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "transfer"): TypedContractMethod<[
		to: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	getFunction(nameOrSignature: "transferFrom"): TypedContractMethod<[
		from: AddressLike,
		to: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	getEvent(key: "Approval"): TypedContractEvent<ApprovalEvent$5.InputTuple, ApprovalEvent$5.OutputTuple, ApprovalEvent$5.OutputObject>;
	getEvent(key: "Transfer"): TypedContractEvent<TransferEvent$5.InputTuple, TransferEvent$5.OutputTuple, TransferEvent$5.OutputObject>;
	filters: {
		"Approval(address,address,uint256)": TypedContractEvent<ApprovalEvent$5.InputTuple, ApprovalEvent$5.OutputTuple, ApprovalEvent$5.OutputObject>;
		Approval: TypedContractEvent<ApprovalEvent$5.InputTuple, ApprovalEvent$5.OutputTuple, ApprovalEvent$5.OutputObject>;
		"Transfer(address,address,uint256)": TypedContractEvent<TransferEvent$5.InputTuple, TransferEvent$5.OutputTuple, TransferEvent$5.OutputObject>;
		Transfer: TypedContractEvent<TransferEvent$5.InputTuple, TransferEvent$5.OutputTuple, TransferEvent$5.OutputObject>;
	};
}
export interface IERC20PermitInterface extends Interface {
	getFunction(nameOrSignature: "DOMAIN_SEPARATOR" | "nonces" | "permit"): FunctionFragment;
	encodeFunctionData(functionFragment: "DOMAIN_SEPARATOR", values?: undefined): string;
	encodeFunctionData(functionFragment: "nonces", values: [
		AddressLike
	]): string;
	encodeFunctionData(functionFragment: "permit", values: [
		AddressLike,
		AddressLike,
		BigNumberish,
		BigNumberish,
		BigNumberish,
		BytesLike,
		BytesLike
	]): string;
	decodeFunctionResult(functionFragment: "DOMAIN_SEPARATOR", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "nonces", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "permit", data: BytesLike): Result;
}
export interface IERC20Permit extends BaseContract {
	connect(runner?: ContractRunner | null): IERC20Permit;
	waitForDeployment(): Promise<this>;
	interface: IERC20PermitInterface;
	queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
	listeners(eventName?: string): Promise<Array<Listener>>;
	removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
	DOMAIN_SEPARATOR: TypedContractMethod<[
	], [
		string
	], "view">;
	nonces: TypedContractMethod<[
		owner: AddressLike
	], [
		bigint
	], "view">;
	permit: TypedContractMethod<[
		owner: AddressLike,
		spender: AddressLike,
		value: BigNumberish,
		deadline: BigNumberish,
		v: BigNumberish,
		r: BytesLike,
		s: BytesLike
	], [
		void
	], "nonpayable">;
	getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
	getFunction(nameOrSignature: "DOMAIN_SEPARATOR"): TypedContractMethod<[
	], [
		string
	], "view">;
	getFunction(nameOrSignature: "nonces"): TypedContractMethod<[
		owner: AddressLike
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "permit"): TypedContractMethod<[
		owner: AddressLike,
		spender: AddressLike,
		value: BigNumberish,
		deadline: BigNumberish,
		v: BigNumberish,
		r: BytesLike,
		s: BytesLike
	], [
		void
	], "nonpayable">;
	filters: {};
}
export interface SafeERC20Interface extends Interface {
}
export interface SafeERC20 extends BaseContract {
	connect(runner?: ContractRunner | null): SafeERC20;
	waitForDeployment(): Promise<this>;
	interface: SafeERC20Interface;
	queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
	listeners(eventName?: string): Promise<Array<Listener>>;
	removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
	getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
	filters: {};
}
export interface AddressInterface extends Interface {
}
export interface Address extends BaseContract {
	connect(runner?: ContractRunner | null): Address;
	waitForDeployment(): Promise<this>;
	interface: AddressInterface;
	queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
	listeners(eventName?: string): Promise<Array<Listener>>;
	removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
	getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
	filters: {};
}
export interface ErrorsInterface extends Interface {
}
export interface Errors extends BaseContract {
	connect(runner?: ContractRunner | null): Errors;
	waitForDeployment(): Promise<this>;
	interface: ErrorsInterface;
	queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
	listeners(eventName?: string): Promise<Array<Listener>>;
	removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
	getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
	filters: {};
}
export interface NoncesInterface extends Interface {
	getFunction(nameOrSignature: "nonces"): FunctionFragment;
	encodeFunctionData(functionFragment: "nonces", values: [
		AddressLike
	]): string;
	decodeFunctionResult(functionFragment: "nonces", data: BytesLike): Result;
}
export interface Nonces extends BaseContract {
	connect(runner?: ContractRunner | null): Nonces;
	waitForDeployment(): Promise<this>;
	interface: NoncesInterface;
	queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
	listeners(eventName?: string): Promise<Array<Listener>>;
	removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
	nonces: TypedContractMethod<[
		owner: AddressLike
	], [
		bigint
	], "view">;
	getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
	getFunction(nameOrSignature: "nonces"): TypedContractMethod<[
		owner: AddressLike
	], [
		bigint
	], "view">;
	filters: {};
}
export interface ShortStringsInterface extends Interface {
}
export interface ShortStrings extends BaseContract {
	connect(runner?: ContractRunner | null): ShortStrings;
	waitForDeployment(): Promise<this>;
	interface: ShortStringsInterface;
	queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
	listeners(eventName?: string): Promise<Array<Listener>>;
	removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
	getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
	filters: {};
}
export interface StringsInterface extends Interface {
}
export interface Strings extends BaseContract {
	connect(runner?: ContractRunner | null): Strings;
	waitForDeployment(): Promise<this>;
	interface: StringsInterface;
	queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
	listeners(eventName?: string): Promise<Array<Listener>>;
	removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
	getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
	filters: {};
}
export interface ECDSAInterface extends Interface {
}
export interface ECDSA extends BaseContract {
	connect(runner?: ContractRunner | null): ECDSA;
	waitForDeployment(): Promise<this>;
	interface: ECDSAInterface;
	queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
	listeners(eventName?: string): Promise<Array<Listener>>;
	removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
	getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
	filters: {};
}
export interface EIP712Interface extends Interface {
	getFunction(nameOrSignature: "eip712Domain"): FunctionFragment;
	getEvent(nameOrSignatureOrTopic: "EIP712DomainChanged"): EventFragment;
	encodeFunctionData(functionFragment: "eip712Domain", values?: undefined): string;
	decodeFunctionResult(functionFragment: "eip712Domain", data: BytesLike): Result;
}
declare namespace EIP712DomainChangedEvent$2 {
	type InputTuple = [
	];
	type OutputTuple = [
	];
	interface OutputObject {
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
export interface EIP712 extends BaseContract {
	connect(runner?: ContractRunner | null): EIP712;
	waitForDeployment(): Promise<this>;
	interface: EIP712Interface;
	queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
	listeners(eventName?: string): Promise<Array<Listener>>;
	removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
	eip712Domain: TypedContractMethod<[
	], [
		[
			string,
			string,
			string,
			bigint,
			string,
			string,
			bigint[]
		] & {
			fields: string;
			name: string;
			version: string;
			chainId: bigint;
			verifyingContract: string;
			salt: string;
			extensions: bigint[];
		}
	], "view">;
	getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
	getFunction(nameOrSignature: "eip712Domain"): TypedContractMethod<[
	], [
		[
			string,
			string,
			string,
			bigint,
			string,
			string,
			bigint[]
		] & {
			fields: string;
			name: string;
			version: string;
			chainId: bigint;
			verifyingContract: string;
			salt: string;
			extensions: bigint[];
		}
	], "view">;
	getEvent(key: "EIP712DomainChanged"): TypedContractEvent<EIP712DomainChangedEvent$2.InputTuple, EIP712DomainChangedEvent$2.OutputTuple, EIP712DomainChangedEvent$2.OutputObject>;
	filters: {
		"EIP712DomainChanged()": TypedContractEvent<EIP712DomainChangedEvent$2.InputTuple, EIP712DomainChangedEvent$2.OutputTuple, EIP712DomainChangedEvent$2.OutputObject>;
		EIP712DomainChanged: TypedContractEvent<EIP712DomainChangedEvent$2.InputTuple, EIP712DomainChangedEvent$2.OutputTuple, EIP712DomainChangedEvent$2.OutputObject>;
	};
}
export interface IERC165Interface extends Interface {
	getFunction(nameOrSignature: "supportsInterface"): FunctionFragment;
	encodeFunctionData(functionFragment: "supportsInterface", values: [
		BytesLike
	]): string;
	decodeFunctionResult(functionFragment: "supportsInterface", data: BytesLike): Result;
}
export interface IERC165 extends BaseContract {
	connect(runner?: ContractRunner | null): IERC165;
	waitForDeployment(): Promise<this>;
	interface: IERC165Interface;
	queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
	listeners(eventName?: string): Promise<Array<Listener>>;
	removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
	supportsInterface: TypedContractMethod<[
		interfaceId: BytesLike
	], [
		boolean
	], "view">;
	getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
	getFunction(nameOrSignature: "supportsInterface"): TypedContractMethod<[
		interfaceId: BytesLike
	], [
		boolean
	], "view">;
	filters: {};
}
export interface SafeCastInterface extends Interface {
}
export interface SafeCast extends BaseContract {
	connect(runner?: ContractRunner | null): SafeCast;
	waitForDeployment(): Promise<this>;
	interface: SafeCastInterface;
	queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
	listeners(eventName?: string): Promise<Array<Listener>>;
	removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
	getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
	filters: {};
}
export interface OwnableUpgradeableInterface extends Interface {
	getFunction(nameOrSignature: "owner" | "renounceOwnership" | "transferOwnership"): FunctionFragment;
	getEvent(nameOrSignatureOrTopic: "Initialized" | "OwnershipTransferred"): EventFragment;
	encodeFunctionData(functionFragment: "owner", values?: undefined): string;
	encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
	encodeFunctionData(functionFragment: "transferOwnership", values: [
		AddressLike
	]): string;
	decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
}
declare namespace InitializedEvent {
	type InputTuple = [
		version: BigNumberish
	];
	type OutputTuple = [
		version: bigint
	];
	interface OutputObject {
		version: bigint;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
declare namespace OwnershipTransferredEvent$1 {
	type InputTuple = [
		previousOwner: AddressLike,
		newOwner: AddressLike
	];
	type OutputTuple = [
		previousOwner: string,
		newOwner: string
	];
	interface OutputObject {
		previousOwner: string;
		newOwner: string;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
export interface OwnableUpgradeable extends BaseContract {
	connect(runner?: ContractRunner | null): OwnableUpgradeable;
	waitForDeployment(): Promise<this>;
	interface: OwnableUpgradeableInterface;
	queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
	listeners(eventName?: string): Promise<Array<Listener>>;
	removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
	owner: TypedContractMethod<[
	], [
		string
	], "view">;
	renounceOwnership: TypedContractMethod<[
	], [
		void
	], "nonpayable">;
	transferOwnership: TypedContractMethod<[
		newOwner: AddressLike
	], [
		void
	], "nonpayable">;
	getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
	getFunction(nameOrSignature: "owner"): TypedContractMethod<[
	], [
		string
	], "view">;
	getFunction(nameOrSignature: "renounceOwnership"): TypedContractMethod<[
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "transferOwnership"): TypedContractMethod<[
		newOwner: AddressLike
	], [
		void
	], "nonpayable">;
	getEvent(key: "Initialized"): TypedContractEvent<InitializedEvent.InputTuple, InitializedEvent.OutputTuple, InitializedEvent.OutputObject>;
	getEvent(key: "OwnershipTransferred"): TypedContractEvent<OwnershipTransferredEvent$1.InputTuple, OwnershipTransferredEvent$1.OutputTuple, OwnershipTransferredEvent$1.OutputObject>;
	filters: {
		"Initialized(uint64)": TypedContractEvent<InitializedEvent.InputTuple, InitializedEvent.OutputTuple, InitializedEvent.OutputObject>;
		Initialized: TypedContractEvent<InitializedEvent.InputTuple, InitializedEvent.OutputTuple, InitializedEvent.OutputObject>;
		"OwnershipTransferred(address,address)": TypedContractEvent<OwnershipTransferredEvent$1.InputTuple, OwnershipTransferredEvent$1.OutputTuple, OwnershipTransferredEvent$1.OutputObject>;
		OwnershipTransferred: TypedContractEvent<OwnershipTransferredEvent$1.InputTuple, OwnershipTransferredEvent$1.OutputTuple, OwnershipTransferredEvent$1.OutputObject>;
	};
}
export interface InitializableInterface extends Interface {
	getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
}
declare namespace InitializedEvent$1 {
	type InputTuple = [
		version: BigNumberish
	];
	type OutputTuple = [
		version: bigint
	];
	interface OutputObject {
		version: bigint;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
export interface Initializable extends BaseContract {
	connect(runner?: ContractRunner | null): Initializable;
	waitForDeployment(): Promise<this>;
	interface: InitializableInterface;
	queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
	listeners(eventName?: string): Promise<Array<Listener>>;
	removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
	getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
	getEvent(key: "Initialized"): TypedContractEvent<InitializedEvent$1.InputTuple, InitializedEvent$1.OutputTuple, InitializedEvent$1.OutputObject>;
	filters: {
		"Initialized(uint64)": TypedContractEvent<InitializedEvent$1.InputTuple, InitializedEvent$1.OutputTuple, InitializedEvent$1.OutputObject>;
		Initialized: TypedContractEvent<InitializedEvent$1.InputTuple, InitializedEvent$1.OutputTuple, InitializedEvent$1.OutputObject>;
	};
}
export interface ContextUpgradeableInterface extends Interface {
	getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
}
declare namespace InitializedEvent$2 {
	type InputTuple = [
		version: BigNumberish
	];
	type OutputTuple = [
		version: bigint
	];
	interface OutputObject {
		version: bigint;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
export interface ContextUpgradeable extends BaseContract {
	connect(runner?: ContractRunner | null): ContextUpgradeable;
	waitForDeployment(): Promise<this>;
	interface: ContextUpgradeableInterface;
	queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
	listeners(eventName?: string): Promise<Array<Listener>>;
	removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
	getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
	getEvent(key: "Initialized"): TypedContractEvent<InitializedEvent$2.InputTuple, InitializedEvent$2.OutputTuple, InitializedEvent$2.OutputObject>;
	filters: {
		"Initialized(uint64)": TypedContractEvent<InitializedEvent$2.InputTuple, InitializedEvent$2.OutputTuple, InitializedEvent$2.OutputObject>;
		Initialized: TypedContractEvent<InitializedEvent$2.InputTuple, InitializedEvent$2.OutputTuple, InitializedEvent$2.OutputObject>;
	};
}
export interface ReentrancyGuardUpgradeableInterface extends Interface {
	getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
}
declare namespace InitializedEvent$3 {
	type InputTuple = [
		version: BigNumberish
	];
	type OutputTuple = [
		version: bigint
	];
	interface OutputObject {
		version: bigint;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
export interface ReentrancyGuardUpgradeable extends BaseContract {
	connect(runner?: ContractRunner | null): ReentrancyGuardUpgradeable;
	waitForDeployment(): Promise<this>;
	interface: ReentrancyGuardUpgradeableInterface;
	queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
	listeners(eventName?: string): Promise<Array<Listener>>;
	removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
	getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
	getEvent(key: "Initialized"): TypedContractEvent<InitializedEvent$3.InputTuple, InitializedEvent$3.OutputTuple, InitializedEvent$3.OutputObject>;
	filters: {
		"Initialized(uint64)": TypedContractEvent<InitializedEvent$3.InputTuple, InitializedEvent$3.OutputTuple, InitializedEvent$3.OutputObject>;
		Initialized: TypedContractEvent<InitializedEvent$3.InputTuple, InitializedEvent$3.OutputTuple, InitializedEvent$3.OutputObject>;
	};
}
export interface GoldMinterInterface extends Interface {
	getFunction(nameOrSignature: "USDC" | "USDT" | "addSettler" | "autoSettle" | "burnOrders" | "calculateGoldFee" | "canBurn" | "canMint" | "fees" | "getGoldAmount" | "getUsdAmount" | "goldPriceFeed" | "goldReserveFeed" | "goldToken" | "initialize" | "initializeGoldMinter" | "levels" | "minGoldAmount" | "minGoldFee" | "minGoldFeeAmount" | "mintOrders" | "owner" | "removeSettler" | "renounceOwnership" | "requestBurn" | "requestBurnPermit" | "requestMint" | "requestMintPermit" | "setLevel" | "settleBurn" | "settleMint" | "settlers" | "slippage" | "tradeLevel" | "transferOwnership" | "updateAutoSettle" | "updateFees" | "updateMinGold" | "updateMinGoldFee" | "updateMinGoldFeeAmount" | "updateRecipient" | "updateSlippage" | "updateTradingLevel" | "usdRecipient"): FunctionFragment;
	getEvent(nameOrSignatureOrTopic: "AddSettler" | "Initialized(uint64)" | "Initialized(address,uint8,address,uint8,address,uint8,address,address)" | "OwnershipTransferred" | "RemoveSettler" | "RequestBurn" | "RequestMint" | "SettleBurn" | "SettleMint" | "UpdateAutoSettle" | "UpdateFees" | "UpdateLevel" | "UpdateMinGold" | "UpdateMinGoldFee" | "UpdateMinGoldFeeAmount" | "UpdateRecipient" | "UpdateSlippage" | "UpdateTradingLevel"): EventFragment;
	encodeFunctionData(functionFragment: "USDC", values?: undefined): string;
	encodeFunctionData(functionFragment: "USDT", values?: undefined): string;
	encodeFunctionData(functionFragment: "addSettler", values: [
		AddressLike
	]): string;
	encodeFunctionData(functionFragment: "autoSettle", values?: undefined): string;
	encodeFunctionData(functionFragment: "burnOrders", values: [
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "calculateGoldFee", values: [
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "canBurn", values: [
		AddressLike,
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "canMint", values: [
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "fees", values?: undefined): string;
	encodeFunctionData(functionFragment: "getGoldAmount", values: [
		AddressLike,
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "getUsdAmount", values: [
		AddressLike,
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "goldPriceFeed", values?: undefined): string;
	encodeFunctionData(functionFragment: "goldReserveFeed", values?: undefined): string;
	encodeFunctionData(functionFragment: "goldToken", values?: undefined): string;
	encodeFunctionData(functionFragment: "initialize", values: [
		AddressLike
	]): string;
	encodeFunctionData(functionFragment: "initializeGoldMinter", values: [
		AddressLike,
		AddressLike,
		AddressLike,
		AddressLike,
		AddressLike,
		AddressLike,
		AddressLike,
		boolean
	]): string;
	encodeFunctionData(functionFragment: "levels", values: [
		AddressLike
	]): string;
	encodeFunctionData(functionFragment: "minGoldAmount", values?: undefined): string;
	encodeFunctionData(functionFragment: "minGoldFee", values?: undefined): string;
	encodeFunctionData(functionFragment: "minGoldFeeAmount", values?: undefined): string;
	encodeFunctionData(functionFragment: "mintOrders", values: [
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "owner", values?: undefined): string;
	encodeFunctionData(functionFragment: "removeSettler", values: [
		AddressLike
	]): string;
	encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
	encodeFunctionData(functionFragment: "requestBurn", values: [
		AddressLike,
		BigNumberish,
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "requestBurnPermit", values: [
		AddressLike,
		BigNumberish,
		BigNumberish,
		BigNumberish,
		BytesLike
	]): string;
	encodeFunctionData(functionFragment: "requestMint", values: [
		AddressLike,
		BigNumberish,
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "requestMintPermit", values: [
		AddressLike,
		BigNumberish,
		BigNumberish,
		BigNumberish,
		BytesLike
	]): string;
	encodeFunctionData(functionFragment: "setLevel", values: [
		AddressLike,
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "settleBurn", values: [
		BigNumberish,
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "settleMint", values: [
		BigNumberish,
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "settlers", values?: undefined): string;
	encodeFunctionData(functionFragment: "slippage", values?: undefined): string;
	encodeFunctionData(functionFragment: "tradeLevel", values?: undefined): string;
	encodeFunctionData(functionFragment: "transferOwnership", values: [
		AddressLike
	]): string;
	encodeFunctionData(functionFragment: "updateAutoSettle", values?: undefined): string;
	encodeFunctionData(functionFragment: "updateFees", values: [
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "updateMinGold", values: [
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "updateMinGoldFee", values: [
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "updateMinGoldFeeAmount", values: [
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "updateRecipient", values: [
		AddressLike
	]): string;
	encodeFunctionData(functionFragment: "updateSlippage", values: [
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "updateTradingLevel", values: [
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "usdRecipient", values?: undefined): string;
	decodeFunctionResult(functionFragment: "USDC", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "USDT", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "addSettler", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "autoSettle", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "burnOrders", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "calculateGoldFee", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "canBurn", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "canMint", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "fees", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "getGoldAmount", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "getUsdAmount", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "goldPriceFeed", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "goldReserveFeed", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "goldToken", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "initializeGoldMinter", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "levels", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "minGoldAmount", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "minGoldFee", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "minGoldFeeAmount", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "mintOrders", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "removeSettler", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "requestBurn", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "requestBurnPermit", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "requestMint", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "requestMintPermit", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "setLevel", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "settleBurn", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "settleMint", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "settlers", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "slippage", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "tradeLevel", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "updateAutoSettle", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "updateFees", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "updateMinGold", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "updateMinGoldFee", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "updateMinGoldFeeAmount", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "updateRecipient", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "updateSlippage", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "updateTradingLevel", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "usdRecipient", data: BytesLike): Result;
}
declare namespace AddSettlerEvent {
	type InputTuple = [
		newSettler: AddressLike
	];
	type OutputTuple = [
		newSettler: string
	];
	interface OutputObject {
		newSettler: string;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
declare namespace Initialized_uint64_Event {
	type InputTuple = [
		version: BigNumberish
	];
	type OutputTuple = [
		version: bigint
	];
	interface OutputObject {
		version: bigint;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
declare namespace Initialized_address_uint8_address_uint8_address_uint8_address_address_Event {
	type InputTuple = [
		goldToken: AddressLike,
		goldTokenDecimals: BigNumberish,
		USDT: AddressLike,
		USDTDecimals: BigNumberish,
		USDC: AddressLike,
		USDCDecimals: BigNumberish,
		goldPriceFeed: AddressLike,
		goldReserveFeed: AddressLike
	];
	type OutputTuple = [
		goldToken: string,
		goldTokenDecimals: bigint,
		USDT: string,
		USDTDecimals: bigint,
		USDC: string,
		USDCDecimals: bigint,
		goldPriceFeed: string,
		goldReserveFeed: string
	];
	interface OutputObject {
		goldToken: string;
		goldTokenDecimals: bigint;
		USDT: string;
		USDTDecimals: bigint;
		USDC: string;
		USDCDecimals: bigint;
		goldPriceFeed: string;
		goldReserveFeed: string;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
declare namespace OwnershipTransferredEvent$2 {
	type InputTuple = [
		previousOwner: AddressLike,
		newOwner: AddressLike
	];
	type OutputTuple = [
		previousOwner: string,
		newOwner: string
	];
	interface OutputObject {
		previousOwner: string;
		newOwner: string;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
declare namespace RemoveSettlerEvent {
	type InputTuple = [
		oldSettler: AddressLike
	];
	type OutputTuple = [
		oldSettler: string
	];
	interface OutputObject {
		oldSettler: string;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
declare namespace RequestBurnEvent {
	type InputTuple = [
		nonce: BigNumberish,
		seller: AddressLike,
		usdToken: AddressLike,
		goldAmount: BigNumberish,
		minUsdAmount: BigNumberish
	];
	type OutputTuple = [
		nonce: bigint,
		seller: string,
		usdToken: string,
		goldAmount: bigint,
		minUsdAmount: bigint
	];
	interface OutputObject {
		nonce: bigint;
		seller: string;
		usdToken: string;
		goldAmount: bigint;
		minUsdAmount: bigint;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
declare namespace RequestMintEvent {
	type InputTuple = [
		nonce: BigNumberish,
		buyer: AddressLike,
		usdToken: AddressLike,
		usdAmount: BigNumberish,
		minGoldAmount: BigNumberish
	];
	type OutputTuple = [
		nonce: bigint,
		buyer: string,
		usdToken: string,
		usdAmount: bigint,
		minGoldAmount: bigint
	];
	interface OutputObject {
		nonce: bigint;
		buyer: string;
		usdToken: string;
		usdAmount: bigint;
		minGoldAmount: bigint;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
declare namespace SettleBurnEvent {
	type InputTuple = [
		nonce: BigNumberish,
		usdAmount: BigNumberish,
		success: boolean
	];
	type OutputTuple = [
		nonce: bigint,
		usdAmount: bigint,
		success: boolean
	];
	interface OutputObject {
		nonce: bigint;
		usdAmount: bigint;
		success: boolean;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
declare namespace SettleMintEvent {
	type InputTuple = [
		nonce: BigNumberish,
		goldAmount: BigNumberish,
		success: boolean
	];
	type OutputTuple = [
		nonce: bigint,
		goldAmount: bigint,
		success: boolean
	];
	interface OutputObject {
		nonce: bigint;
		goldAmount: bigint;
		success: boolean;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
declare namespace UpdateAutoSettleEvent {
	type InputTuple = [
		settle: boolean
	];
	type OutputTuple = [
		settle: boolean
	];
	interface OutputObject {
		settle: boolean;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
declare namespace UpdateFeesEvent {
	type InputTuple = [
		newFees: BigNumberish
	];
	type OutputTuple = [
		newFees: bigint
	];
	interface OutputObject {
		newFees: bigint;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
declare namespace UpdateLevelEvent {
	type InputTuple = [
		user: AddressLike,
		level: BigNumberish
	];
	type OutputTuple = [
		user: string,
		level: bigint
	];
	interface OutputObject {
		user: string;
		level: bigint;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
declare namespace UpdateMinGoldEvent {
	type InputTuple = [
		minGoldAmount: BigNumberish
	];
	type OutputTuple = [
		minGoldAmount: bigint
	];
	interface OutputObject {
		minGoldAmount: bigint;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
declare namespace UpdateMinGoldFeeEvent {
	type InputTuple = [
		minGoldFee: BigNumberish
	];
	type OutputTuple = [
		minGoldFee: bigint
	];
	interface OutputObject {
		minGoldFee: bigint;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
declare namespace UpdateMinGoldFeeAmountEvent {
	type InputTuple = [
		minGoldFeeAmount: BigNumberish
	];
	type OutputTuple = [
		minGoldFeeAmount: bigint
	];
	interface OutputObject {
		minGoldFeeAmount: bigint;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
declare namespace UpdateRecipientEvent {
	type InputTuple = [
		newRecipient: AddressLike
	];
	type OutputTuple = [
		newRecipient: string
	];
	interface OutputObject {
		newRecipient: string;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
declare namespace UpdateSlippageEvent {
	type InputTuple = [
		newSlippage: BigNumberish
	];
	type OutputTuple = [
		newSlippage: bigint
	];
	interface OutputObject {
		newSlippage: bigint;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
declare namespace UpdateTradingLevelEvent {
	type InputTuple = [
		level: BigNumberish
	];
	type OutputTuple = [
		level: bigint
	];
	interface OutputObject {
		level: bigint;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
export interface GoldMinter extends BaseContract {
	connect(runner?: ContractRunner | null): GoldMinter;
	waitForDeployment(): Promise<this>;
	interface: GoldMinterInterface;
	queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
	listeners(eventName?: string): Promise<Array<Listener>>;
	removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
	USDC: TypedContractMethod<[
	], [
		string
	], "view">;
	USDT: TypedContractMethod<[
	], [
		string
	], "view">;
	addSettler: TypedContractMethod<[
		_settler: AddressLike
	], [
		void
	], "nonpayable">;
	autoSettle: TypedContractMethod<[
	], [
		boolean
	], "view">;
	burnOrders: TypedContractMethod<[
		arg0: BigNumberish
	], [
		[
			string,
			string,
			bigint,
			bigint,
			bigint,
			boolean,
			boolean
		] & {
			seller: string;
			usdToken: string;
			goldAmount: bigint;
			minUsdAmount: bigint;
			usdAmount: bigint;
			success: boolean;
			isSettled: boolean;
		}
	], "view">;
	calculateGoldFee: TypedContractMethod<[
		_goldAmount: BigNumberish
	], [
		bigint
	], "view">;
	canBurn: TypedContractMethod<[
		usdToken: AddressLike,
		usdAmount: BigNumberish
	], [
		boolean
	], "view">;
	canMint: TypedContractMethod<[
		goldAmount: BigNumberish
	], [
		boolean
	], "view">;
	fees: TypedContractMethod<[
	], [
		bigint
	], "view">;
	getGoldAmount: TypedContractMethod<[
		usdToken: AddressLike,
		usdAmount: BigNumberish
	], [
		bigint
	], "view">;
	getUsdAmount: TypedContractMethod<[
		usdToken: AddressLike,
		goldAmount: BigNumberish
	], [
		bigint
	], "view">;
	goldPriceFeed: TypedContractMethod<[
	], [
		string
	], "view">;
	goldReserveFeed: TypedContractMethod<[
	], [
		string
	], "view">;
	goldToken: TypedContractMethod<[
	], [
		string
	], "view">;
	initialize: TypedContractMethod<[
		_initOwner: AddressLike
	], [
		void
	], "nonpayable">;
	initializeGoldMinter: TypedContractMethod<[
		_goldToken: AddressLike,
		_USDT: AddressLike,
		_USDC: AddressLike,
		_goldPriceFeed: AddressLike,
		_goldReserveFeed: AddressLike,
		_usdRecipient: AddressLike,
		_owner: AddressLike,
		_autoSettle: boolean
	], [
		void
	], "nonpayable">;
	levels: TypedContractMethod<[
		arg0: AddressLike
	], [
		bigint
	], "view">;
	minGoldAmount: TypedContractMethod<[
	], [
		bigint
	], "view">;
	minGoldFee: TypedContractMethod<[
	], [
		bigint
	], "view">;
	minGoldFeeAmount: TypedContractMethod<[
	], [
		bigint
	], "view">;
	mintOrders: TypedContractMethod<[
		arg0: BigNumberish
	], [
		[
			string,
			string,
			bigint,
			bigint,
			bigint,
			boolean,
			boolean
		] & {
			buyer: string;
			usdToken: string;
			usdAmount: bigint;
			minGoldAmount: bigint;
			goldAmount: bigint;
			success: boolean;
			isSettled: boolean;
		}
	], "view">;
	owner: TypedContractMethod<[
	], [
		string
	], "view">;
	removeSettler: TypedContractMethod<[
		_settler: AddressLike
	], [
		void
	], "nonpayable">;
	renounceOwnership: TypedContractMethod<[
	], [
		void
	], "nonpayable">;
	requestBurn: TypedContractMethod<[
		_usdToken: AddressLike,
		_goldAmount: BigNumberish,
		_minUsdAmount: BigNumberish
	], [
		void
	], "nonpayable">;
	requestBurnPermit: TypedContractMethod<[
		_usdToken: AddressLike,
		_goldAmount: BigNumberish,
		_minUsdAmount: BigNumberish,
		_sigDeadline: BigNumberish,
		_signature: BytesLike
	], [
		void
	], "nonpayable">;
	requestMint: TypedContractMethod<[
		_usdToken: AddressLike,
		_usdAmount: BigNumberish,
		_minGoldAmount: BigNumberish
	], [
		void
	], "nonpayable">;
	requestMintPermit: TypedContractMethod<[
		_usdToken: AddressLike,
		_usdAmount: BigNumberish,
		_minGoldAmount: BigNumberish,
		_sigDeadline: BigNumberish,
		_signature: BytesLike
	], [
		void
	], "nonpayable">;
	setLevel: TypedContractMethod<[
		user: AddressLike,
		level: BigNumberish
	], [
		void
	], "nonpayable">;
	settleBurn: TypedContractMethod<[
		burnNonce: BigNumberish,
		usdAmount: BigNumberish
	], [
		void
	], "nonpayable">;
	settleMint: TypedContractMethod<[
		mintNonce: BigNumberish,
		goldAmount: BigNumberish
	], [
		void
	], "nonpayable">;
	settlers: TypedContractMethod<[
	], [
		string[]
	], "view">;
	slippage: TypedContractMethod<[
	], [
		bigint
	], "view">;
	tradeLevel: TypedContractMethod<[
	], [
		bigint
	], "view">;
	transferOwnership: TypedContractMethod<[
		newOwner: AddressLike
	], [
		void
	], "nonpayable">;
	updateAutoSettle: TypedContractMethod<[
	], [
		void
	], "nonpayable">;
	updateFees: TypedContractMethod<[
		_fees: BigNumberish
	], [
		void
	], "nonpayable">;
	updateMinGold: TypedContractMethod<[
		_minGold: BigNumberish
	], [
		void
	], "nonpayable">;
	updateMinGoldFee: TypedContractMethod<[
		_minGoldFee: BigNumberish
	], [
		void
	], "nonpayable">;
	updateMinGoldFeeAmount: TypedContractMethod<[
		_minGoldFeeAmount: BigNumberish
	], [
		void
	], "nonpayable">;
	updateRecipient: TypedContractMethod<[
		_usdRecipient: AddressLike
	], [
		void
	], "nonpayable">;
	updateSlippage: TypedContractMethod<[
		_slippage: BigNumberish
	], [
		void
	], "nonpayable">;
	updateTradingLevel: TypedContractMethod<[
		level: BigNumberish
	], [
		void
	], "nonpayable">;
	usdRecipient: TypedContractMethod<[
	], [
		string
	], "view">;
	getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
	getFunction(nameOrSignature: "USDC"): TypedContractMethod<[
	], [
		string
	], "view">;
	getFunction(nameOrSignature: "USDT"): TypedContractMethod<[
	], [
		string
	], "view">;
	getFunction(nameOrSignature: "addSettler"): TypedContractMethod<[
		_settler: AddressLike
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "autoSettle"): TypedContractMethod<[
	], [
		boolean
	], "view">;
	getFunction(nameOrSignature: "burnOrders"): TypedContractMethod<[
		arg0: BigNumberish
	], [
		[
			string,
			string,
			bigint,
			bigint,
			bigint,
			boolean,
			boolean
		] & {
			seller: string;
			usdToken: string;
			goldAmount: bigint;
			minUsdAmount: bigint;
			usdAmount: bigint;
			success: boolean;
			isSettled: boolean;
		}
	], "view">;
	getFunction(nameOrSignature: "calculateGoldFee"): TypedContractMethod<[
		_goldAmount: BigNumberish
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "canBurn"): TypedContractMethod<[
		usdToken: AddressLike,
		usdAmount: BigNumberish
	], [
		boolean
	], "view">;
	getFunction(nameOrSignature: "canMint"): TypedContractMethod<[
		goldAmount: BigNumberish
	], [
		boolean
	], "view">;
	getFunction(nameOrSignature: "fees"): TypedContractMethod<[
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "getGoldAmount"): TypedContractMethod<[
		usdToken: AddressLike,
		usdAmount: BigNumberish
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "getUsdAmount"): TypedContractMethod<[
		usdToken: AddressLike,
		goldAmount: BigNumberish
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "goldPriceFeed"): TypedContractMethod<[
	], [
		string
	], "view">;
	getFunction(nameOrSignature: "goldReserveFeed"): TypedContractMethod<[
	], [
		string
	], "view">;
	getFunction(nameOrSignature: "goldToken"): TypedContractMethod<[
	], [
		string
	], "view">;
	getFunction(nameOrSignature: "initialize"): TypedContractMethod<[
		_initOwner: AddressLike
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "initializeGoldMinter"): TypedContractMethod<[
		_goldToken: AddressLike,
		_USDT: AddressLike,
		_USDC: AddressLike,
		_goldPriceFeed: AddressLike,
		_goldReserveFeed: AddressLike,
		_usdRecipient: AddressLike,
		_owner: AddressLike,
		_autoSettle: boolean
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "levels"): TypedContractMethod<[
		arg0: AddressLike
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "minGoldAmount"): TypedContractMethod<[
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "minGoldFee"): TypedContractMethod<[
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "minGoldFeeAmount"): TypedContractMethod<[
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "mintOrders"): TypedContractMethod<[
		arg0: BigNumberish
	], [
		[
			string,
			string,
			bigint,
			bigint,
			bigint,
			boolean,
			boolean
		] & {
			buyer: string;
			usdToken: string;
			usdAmount: bigint;
			minGoldAmount: bigint;
			goldAmount: bigint;
			success: boolean;
			isSettled: boolean;
		}
	], "view">;
	getFunction(nameOrSignature: "owner"): TypedContractMethod<[
	], [
		string
	], "view">;
	getFunction(nameOrSignature: "removeSettler"): TypedContractMethod<[
		_settler: AddressLike
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "renounceOwnership"): TypedContractMethod<[
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "requestBurn"): TypedContractMethod<[
		_usdToken: AddressLike,
		_goldAmount: BigNumberish,
		_minUsdAmount: BigNumberish
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "requestBurnPermit"): TypedContractMethod<[
		_usdToken: AddressLike,
		_goldAmount: BigNumberish,
		_minUsdAmount: BigNumberish,
		_sigDeadline: BigNumberish,
		_signature: BytesLike
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "requestMint"): TypedContractMethod<[
		_usdToken: AddressLike,
		_usdAmount: BigNumberish,
		_minGoldAmount: BigNumberish
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "requestMintPermit"): TypedContractMethod<[
		_usdToken: AddressLike,
		_usdAmount: BigNumberish,
		_minGoldAmount: BigNumberish,
		_sigDeadline: BigNumberish,
		_signature: BytesLike
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "setLevel"): TypedContractMethod<[
		user: AddressLike,
		level: BigNumberish
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "settleBurn"): TypedContractMethod<[
		burnNonce: BigNumberish,
		usdAmount: BigNumberish
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "settleMint"): TypedContractMethod<[
		mintNonce: BigNumberish,
		goldAmount: BigNumberish
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "settlers"): TypedContractMethod<[
	], [
		string[]
	], "view">;
	getFunction(nameOrSignature: "slippage"): TypedContractMethod<[
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "tradeLevel"): TypedContractMethod<[
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "transferOwnership"): TypedContractMethod<[
		newOwner: AddressLike
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "updateAutoSettle"): TypedContractMethod<[
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "updateFees"): TypedContractMethod<[
		_fees: BigNumberish
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "updateMinGold"): TypedContractMethod<[
		_minGold: BigNumberish
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "updateMinGoldFee"): TypedContractMethod<[
		_minGoldFee: BigNumberish
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "updateMinGoldFeeAmount"): TypedContractMethod<[
		_minGoldFeeAmount: BigNumberish
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "updateRecipient"): TypedContractMethod<[
		_usdRecipient: AddressLike
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "updateSlippage"): TypedContractMethod<[
		_slippage: BigNumberish
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "updateTradingLevel"): TypedContractMethod<[
		level: BigNumberish
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "usdRecipient"): TypedContractMethod<[
	], [
		string
	], "view">;
	getEvent(key: "AddSettler"): TypedContractEvent<AddSettlerEvent.InputTuple, AddSettlerEvent.OutputTuple, AddSettlerEvent.OutputObject>;
	getEvent(key: "Initialized(uint64)"): TypedContractEvent<Initialized_uint64_Event.InputTuple, Initialized_uint64_Event.OutputTuple, Initialized_uint64_Event.OutputObject>;
	getEvent(key: "Initialized(address,uint8,address,uint8,address,uint8,address,address)"): TypedContractEvent<Initialized_address_uint8_address_uint8_address_uint8_address_address_Event.InputTuple, Initialized_address_uint8_address_uint8_address_uint8_address_address_Event.OutputTuple, Initialized_address_uint8_address_uint8_address_uint8_address_address_Event.OutputObject>;
	getEvent(key: "OwnershipTransferred"): TypedContractEvent<OwnershipTransferredEvent$2.InputTuple, OwnershipTransferredEvent$2.OutputTuple, OwnershipTransferredEvent$2.OutputObject>;
	getEvent(key: "RemoveSettler"): TypedContractEvent<RemoveSettlerEvent.InputTuple, RemoveSettlerEvent.OutputTuple, RemoveSettlerEvent.OutputObject>;
	getEvent(key: "RequestBurn"): TypedContractEvent<RequestBurnEvent.InputTuple, RequestBurnEvent.OutputTuple, RequestBurnEvent.OutputObject>;
	getEvent(key: "RequestMint"): TypedContractEvent<RequestMintEvent.InputTuple, RequestMintEvent.OutputTuple, RequestMintEvent.OutputObject>;
	getEvent(key: "SettleBurn"): TypedContractEvent<SettleBurnEvent.InputTuple, SettleBurnEvent.OutputTuple, SettleBurnEvent.OutputObject>;
	getEvent(key: "SettleMint"): TypedContractEvent<SettleMintEvent.InputTuple, SettleMintEvent.OutputTuple, SettleMintEvent.OutputObject>;
	getEvent(key: "UpdateAutoSettle"): TypedContractEvent<UpdateAutoSettleEvent.InputTuple, UpdateAutoSettleEvent.OutputTuple, UpdateAutoSettleEvent.OutputObject>;
	getEvent(key: "UpdateFees"): TypedContractEvent<UpdateFeesEvent.InputTuple, UpdateFeesEvent.OutputTuple, UpdateFeesEvent.OutputObject>;
	getEvent(key: "UpdateLevel"): TypedContractEvent<UpdateLevelEvent.InputTuple, UpdateLevelEvent.OutputTuple, UpdateLevelEvent.OutputObject>;
	getEvent(key: "UpdateMinGold"): TypedContractEvent<UpdateMinGoldEvent.InputTuple, UpdateMinGoldEvent.OutputTuple, UpdateMinGoldEvent.OutputObject>;
	getEvent(key: "UpdateMinGoldFee"): TypedContractEvent<UpdateMinGoldFeeEvent.InputTuple, UpdateMinGoldFeeEvent.OutputTuple, UpdateMinGoldFeeEvent.OutputObject>;
	getEvent(key: "UpdateMinGoldFeeAmount"): TypedContractEvent<UpdateMinGoldFeeAmountEvent.InputTuple, UpdateMinGoldFeeAmountEvent.OutputTuple, UpdateMinGoldFeeAmountEvent.OutputObject>;
	getEvent(key: "UpdateRecipient"): TypedContractEvent<UpdateRecipientEvent.InputTuple, UpdateRecipientEvent.OutputTuple, UpdateRecipientEvent.OutputObject>;
	getEvent(key: "UpdateSlippage"): TypedContractEvent<UpdateSlippageEvent.InputTuple, UpdateSlippageEvent.OutputTuple, UpdateSlippageEvent.OutputObject>;
	getEvent(key: "UpdateTradingLevel"): TypedContractEvent<UpdateTradingLevelEvent.InputTuple, UpdateTradingLevelEvent.OutputTuple, UpdateTradingLevelEvent.OutputObject>;
	filters: {
		"AddSettler(address)": TypedContractEvent<AddSettlerEvent.InputTuple, AddSettlerEvent.OutputTuple, AddSettlerEvent.OutputObject>;
		AddSettler: TypedContractEvent<AddSettlerEvent.InputTuple, AddSettlerEvent.OutputTuple, AddSettlerEvent.OutputObject>;
		"Initialized(uint64)": TypedContractEvent<Initialized_uint64_Event.InputTuple, Initialized_uint64_Event.OutputTuple, Initialized_uint64_Event.OutputObject>;
		"Initialized(address,uint8,address,uint8,address,uint8,address,address)": TypedContractEvent<Initialized_address_uint8_address_uint8_address_uint8_address_address_Event.InputTuple, Initialized_address_uint8_address_uint8_address_uint8_address_address_Event.OutputTuple, Initialized_address_uint8_address_uint8_address_uint8_address_address_Event.OutputObject>;
		"OwnershipTransferred(address,address)": TypedContractEvent<OwnershipTransferredEvent$2.InputTuple, OwnershipTransferredEvent$2.OutputTuple, OwnershipTransferredEvent$2.OutputObject>;
		OwnershipTransferred: TypedContractEvent<OwnershipTransferredEvent$2.InputTuple, OwnershipTransferredEvent$2.OutputTuple, OwnershipTransferredEvent$2.OutputObject>;
		"RemoveSettler(address)": TypedContractEvent<RemoveSettlerEvent.InputTuple, RemoveSettlerEvent.OutputTuple, RemoveSettlerEvent.OutputObject>;
		RemoveSettler: TypedContractEvent<RemoveSettlerEvent.InputTuple, RemoveSettlerEvent.OutputTuple, RemoveSettlerEvent.OutputObject>;
		"RequestBurn(uint256,address,address,uint256,uint256)": TypedContractEvent<RequestBurnEvent.InputTuple, RequestBurnEvent.OutputTuple, RequestBurnEvent.OutputObject>;
		RequestBurn: TypedContractEvent<RequestBurnEvent.InputTuple, RequestBurnEvent.OutputTuple, RequestBurnEvent.OutputObject>;
		"RequestMint(uint256,address,address,uint256,uint256)": TypedContractEvent<RequestMintEvent.InputTuple, RequestMintEvent.OutputTuple, RequestMintEvent.OutputObject>;
		RequestMint: TypedContractEvent<RequestMintEvent.InputTuple, RequestMintEvent.OutputTuple, RequestMintEvent.OutputObject>;
		"SettleBurn(uint256,uint256,bool)": TypedContractEvent<SettleBurnEvent.InputTuple, SettleBurnEvent.OutputTuple, SettleBurnEvent.OutputObject>;
		SettleBurn: TypedContractEvent<SettleBurnEvent.InputTuple, SettleBurnEvent.OutputTuple, SettleBurnEvent.OutputObject>;
		"SettleMint(uint256,uint256,bool)": TypedContractEvent<SettleMintEvent.InputTuple, SettleMintEvent.OutputTuple, SettleMintEvent.OutputObject>;
		SettleMint: TypedContractEvent<SettleMintEvent.InputTuple, SettleMintEvent.OutputTuple, SettleMintEvent.OutputObject>;
		"UpdateAutoSettle(bool)": TypedContractEvent<UpdateAutoSettleEvent.InputTuple, UpdateAutoSettleEvent.OutputTuple, UpdateAutoSettleEvent.OutputObject>;
		UpdateAutoSettle: TypedContractEvent<UpdateAutoSettleEvent.InputTuple, UpdateAutoSettleEvent.OutputTuple, UpdateAutoSettleEvent.OutputObject>;
		"UpdateFees(uint16)": TypedContractEvent<UpdateFeesEvent.InputTuple, UpdateFeesEvent.OutputTuple, UpdateFeesEvent.OutputObject>;
		UpdateFees: TypedContractEvent<UpdateFeesEvent.InputTuple, UpdateFeesEvent.OutputTuple, UpdateFeesEvent.OutputObject>;
		"UpdateLevel(address,uint8)": TypedContractEvent<UpdateLevelEvent.InputTuple, UpdateLevelEvent.OutputTuple, UpdateLevelEvent.OutputObject>;
		UpdateLevel: TypedContractEvent<UpdateLevelEvent.InputTuple, UpdateLevelEvent.OutputTuple, UpdateLevelEvent.OutputObject>;
		"UpdateMinGold(uint256)": TypedContractEvent<UpdateMinGoldEvent.InputTuple, UpdateMinGoldEvent.OutputTuple, UpdateMinGoldEvent.OutputObject>;
		UpdateMinGold: TypedContractEvent<UpdateMinGoldEvent.InputTuple, UpdateMinGoldEvent.OutputTuple, UpdateMinGoldEvent.OutputObject>;
		"UpdateMinGoldFee(uint256)": TypedContractEvent<UpdateMinGoldFeeEvent.InputTuple, UpdateMinGoldFeeEvent.OutputTuple, UpdateMinGoldFeeEvent.OutputObject>;
		UpdateMinGoldFee: TypedContractEvent<UpdateMinGoldFeeEvent.InputTuple, UpdateMinGoldFeeEvent.OutputTuple, UpdateMinGoldFeeEvent.OutputObject>;
		"UpdateMinGoldFeeAmount(uint256)": TypedContractEvent<UpdateMinGoldFeeAmountEvent.InputTuple, UpdateMinGoldFeeAmountEvent.OutputTuple, UpdateMinGoldFeeAmountEvent.OutputObject>;
		UpdateMinGoldFeeAmount: TypedContractEvent<UpdateMinGoldFeeAmountEvent.InputTuple, UpdateMinGoldFeeAmountEvent.OutputTuple, UpdateMinGoldFeeAmountEvent.OutputObject>;
		"UpdateRecipient(address)": TypedContractEvent<UpdateRecipientEvent.InputTuple, UpdateRecipientEvent.OutputTuple, UpdateRecipientEvent.OutputObject>;
		UpdateRecipient: TypedContractEvent<UpdateRecipientEvent.InputTuple, UpdateRecipientEvent.OutputTuple, UpdateRecipientEvent.OutputObject>;
		"UpdateSlippage(uint16)": TypedContractEvent<UpdateSlippageEvent.InputTuple, UpdateSlippageEvent.OutputTuple, UpdateSlippageEvent.OutputObject>;
		UpdateSlippage: TypedContractEvent<UpdateSlippageEvent.InputTuple, UpdateSlippageEvent.OutputTuple, UpdateSlippageEvent.OutputObject>;
		"UpdateTradingLevel(uint8)": TypedContractEvent<UpdateTradingLevelEvent.InputTuple, UpdateTradingLevelEvent.OutputTuple, UpdateTradingLevelEvent.OutputObject>;
		UpdateTradingLevel: TypedContractEvent<UpdateTradingLevelEvent.InputTuple, UpdateTradingLevelEvent.OutputTuple, UpdateTradingLevelEvent.OutputObject>;
	};
}
export interface LockInterface extends Interface {
	getFunction(nameOrSignature: "owner" | "unlockTime" | "withdraw"): FunctionFragment;
	getEvent(nameOrSignatureOrTopic: "Withdrawal"): EventFragment;
	encodeFunctionData(functionFragment: "owner", values?: undefined): string;
	encodeFunctionData(functionFragment: "unlockTime", values?: undefined): string;
	encodeFunctionData(functionFragment: "withdraw", values?: undefined): string;
	decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "unlockTime", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
}
declare namespace WithdrawalEvent {
	type InputTuple = [
		amount: BigNumberish,
		when: BigNumberish
	];
	type OutputTuple = [
		amount: bigint,
		when: bigint
	];
	interface OutputObject {
		amount: bigint;
		when: bigint;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
interface Lock$1 extends BaseContract {
	connect(runner?: ContractRunner | null): Lock$1;
	waitForDeployment(): Promise<this>;
	interface: LockInterface;
	queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
	listeners(eventName?: string): Promise<Array<Listener>>;
	removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
	owner: TypedContractMethod<[
	], [
		string
	], "view">;
	unlockTime: TypedContractMethod<[
	], [
		bigint
	], "view">;
	withdraw: TypedContractMethod<[
	], [
		void
	], "nonpayable">;
	getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
	getFunction(nameOrSignature: "owner"): TypedContractMethod<[
	], [
		string
	], "view">;
	getFunction(nameOrSignature: "unlockTime"): TypedContractMethod<[
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "withdraw"): TypedContractMethod<[
	], [
		void
	], "nonpayable">;
	getEvent(key: "Withdrawal"): TypedContractEvent<WithdrawalEvent.InputTuple, WithdrawalEvent.OutputTuple, WithdrawalEvent.OutputObject>;
	filters: {
		"Withdrawal(uint256,uint256)": TypedContractEvent<WithdrawalEvent.InputTuple, WithdrawalEvent.OutputTuple, WithdrawalEvent.OutputObject>;
		Withdrawal: TypedContractEvent<WithdrawalEvent.InputTuple, WithdrawalEvent.OutputTuple, WithdrawalEvent.OutputObject>;
	};
}
export interface IERC20ExpInterface extends Interface {
	getFunction(nameOrSignature: "DOMAIN_SEPARATOR" | "allowance" | "approve" | "balanceOf" | "decimals" | "name" | "nonces" | "permit" | "symbol" | "totalSupply" | "transfer" | "transferFrom"): FunctionFragment;
	getEvent(nameOrSignatureOrTopic: "Approval" | "Transfer"): EventFragment;
	encodeFunctionData(functionFragment: "DOMAIN_SEPARATOR", values?: undefined): string;
	encodeFunctionData(functionFragment: "allowance", values: [
		AddressLike,
		AddressLike
	]): string;
	encodeFunctionData(functionFragment: "approve", values: [
		AddressLike,
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "balanceOf", values: [
		AddressLike
	]): string;
	encodeFunctionData(functionFragment: "decimals", values?: undefined): string;
	encodeFunctionData(functionFragment: "name", values?: undefined): string;
	encodeFunctionData(functionFragment: "nonces", values: [
		AddressLike
	]): string;
	encodeFunctionData(functionFragment: "permit", values: [
		AddressLike,
		AddressLike,
		BigNumberish,
		BigNumberish,
		BigNumberish,
		BytesLike,
		BytesLike
	]): string;
	encodeFunctionData(functionFragment: "symbol", values?: undefined): string;
	encodeFunctionData(functionFragment: "totalSupply", values?: undefined): string;
	encodeFunctionData(functionFragment: "transfer", values: [
		AddressLike,
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "transferFrom", values: [
		AddressLike,
		AddressLike,
		BigNumberish
	]): string;
	decodeFunctionResult(functionFragment: "DOMAIN_SEPARATOR", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "allowance", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "decimals", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "nonces", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "permit", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "symbol", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "totalSupply", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "transfer", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "transferFrom", data: BytesLike): Result;
}
declare namespace ApprovalEvent$6 {
	type InputTuple = [
		owner: AddressLike,
		spender: AddressLike,
		value: BigNumberish
	];
	type OutputTuple = [
		owner: string,
		spender: string,
		value: bigint
	];
	interface OutputObject {
		owner: string;
		spender: string;
		value: bigint;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
declare namespace TransferEvent$6 {
	type InputTuple = [
		from: AddressLike,
		to: AddressLike,
		value: BigNumberish
	];
	type OutputTuple = [
		from: string,
		to: string,
		value: bigint
	];
	interface OutputObject {
		from: string;
		to: string;
		value: bigint;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
export interface IERC20Exp extends BaseContract {
	connect(runner?: ContractRunner | null): IERC20Exp;
	waitForDeployment(): Promise<this>;
	interface: IERC20ExpInterface;
	queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
	listeners(eventName?: string): Promise<Array<Listener>>;
	removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
	DOMAIN_SEPARATOR: TypedContractMethod<[
	], [
		string
	], "view">;
	allowance: TypedContractMethod<[
		owner: AddressLike,
		spender: AddressLike
	], [
		bigint
	], "view">;
	approve: TypedContractMethod<[
		spender: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	balanceOf: TypedContractMethod<[
		account: AddressLike
	], [
		bigint
	], "view">;
	decimals: TypedContractMethod<[
	], [
		bigint
	], "view">;
	name: TypedContractMethod<[
	], [
		string
	], "view">;
	nonces: TypedContractMethod<[
		owner: AddressLike
	], [
		bigint
	], "view">;
	permit: TypedContractMethod<[
		owner: AddressLike,
		spender: AddressLike,
		value: BigNumberish,
		deadline: BigNumberish,
		v: BigNumberish,
		r: BytesLike,
		s: BytesLike
	], [
		void
	], "nonpayable">;
	symbol: TypedContractMethod<[
	], [
		string
	], "view">;
	totalSupply: TypedContractMethod<[
	], [
		bigint
	], "view">;
	transfer: TypedContractMethod<[
		to: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	transferFrom: TypedContractMethod<[
		from: AddressLike,
		to: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
	getFunction(nameOrSignature: "DOMAIN_SEPARATOR"): TypedContractMethod<[
	], [
		string
	], "view">;
	getFunction(nameOrSignature: "allowance"): TypedContractMethod<[
		owner: AddressLike,
		spender: AddressLike
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "approve"): TypedContractMethod<[
		spender: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	getFunction(nameOrSignature: "balanceOf"): TypedContractMethod<[
		account: AddressLike
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "decimals"): TypedContractMethod<[
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "name"): TypedContractMethod<[
	], [
		string
	], "view">;
	getFunction(nameOrSignature: "nonces"): TypedContractMethod<[
		owner: AddressLike
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "permit"): TypedContractMethod<[
		owner: AddressLike,
		spender: AddressLike,
		value: BigNumberish,
		deadline: BigNumberish,
		v: BigNumberish,
		r: BytesLike,
		s: BytesLike
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "symbol"): TypedContractMethod<[
	], [
		string
	], "view">;
	getFunction(nameOrSignature: "totalSupply"): TypedContractMethod<[
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "transfer"): TypedContractMethod<[
		to: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	getFunction(nameOrSignature: "transferFrom"): TypedContractMethod<[
		from: AddressLike,
		to: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	getEvent(key: "Approval"): TypedContractEvent<ApprovalEvent$6.InputTuple, ApprovalEvent$6.OutputTuple, ApprovalEvent$6.OutputObject>;
	getEvent(key: "Transfer"): TypedContractEvent<TransferEvent$6.InputTuple, TransferEvent$6.OutputTuple, TransferEvent$6.OutputObject>;
	filters: {
		"Approval(address,address,uint256)": TypedContractEvent<ApprovalEvent$6.InputTuple, ApprovalEvent$6.OutputTuple, ApprovalEvent$6.OutputObject>;
		Approval: TypedContractEvent<ApprovalEvent$6.InputTuple, ApprovalEvent$6.OutputTuple, ApprovalEvent$6.OutputObject>;
		"Transfer(address,address,uint256)": TypedContractEvent<TransferEvent$6.InputTuple, TransferEvent$6.OutputTuple, TransferEvent$6.OutputObject>;
		Transfer: TypedContractEvent<TransferEvent$6.InputTuple, TransferEvent$6.OutputTuple, TransferEvent$6.OutputObject>;
	};
}
export interface IERC20MintableInterface extends Interface {
	getFunction(nameOrSignature: "DOMAIN_SEPARATOR" | "allowance" | "approve" | "balanceOf" | "burn" | "burnFrom" | "decimals" | "mint" | "name" | "nonces" | "permit" | "symbol" | "totalSupply" | "transfer" | "transferFrom"): FunctionFragment;
	getEvent(nameOrSignatureOrTopic: "Approval" | "Transfer"): EventFragment;
	encodeFunctionData(functionFragment: "DOMAIN_SEPARATOR", values?: undefined): string;
	encodeFunctionData(functionFragment: "allowance", values: [
		AddressLike,
		AddressLike
	]): string;
	encodeFunctionData(functionFragment: "approve", values: [
		AddressLike,
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "balanceOf", values: [
		AddressLike
	]): string;
	encodeFunctionData(functionFragment: "burn", values: [
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "burnFrom", values: [
		AddressLike,
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "decimals", values?: undefined): string;
	encodeFunctionData(functionFragment: "mint", values: [
		AddressLike,
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "name", values?: undefined): string;
	encodeFunctionData(functionFragment: "nonces", values: [
		AddressLike
	]): string;
	encodeFunctionData(functionFragment: "permit", values: [
		AddressLike,
		AddressLike,
		BigNumberish,
		BigNumberish,
		BigNumberish,
		BytesLike,
		BytesLike
	]): string;
	encodeFunctionData(functionFragment: "symbol", values?: undefined): string;
	encodeFunctionData(functionFragment: "totalSupply", values?: undefined): string;
	encodeFunctionData(functionFragment: "transfer", values: [
		AddressLike,
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "transferFrom", values: [
		AddressLike,
		AddressLike,
		BigNumberish
	]): string;
	decodeFunctionResult(functionFragment: "DOMAIN_SEPARATOR", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "allowance", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "burn", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "burnFrom", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "decimals", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "mint", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "nonces", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "permit", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "symbol", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "totalSupply", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "transfer", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "transferFrom", data: BytesLike): Result;
}
declare namespace ApprovalEvent$7 {
	type InputTuple = [
		owner: AddressLike,
		spender: AddressLike,
		value: BigNumberish
	];
	type OutputTuple = [
		owner: string,
		spender: string,
		value: bigint
	];
	interface OutputObject {
		owner: string;
		spender: string;
		value: bigint;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
declare namespace TransferEvent$7 {
	type InputTuple = [
		from: AddressLike,
		to: AddressLike,
		value: BigNumberish
	];
	type OutputTuple = [
		from: string,
		to: string,
		value: bigint
	];
	interface OutputObject {
		from: string;
		to: string;
		value: bigint;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
export interface IERC20Mintable extends BaseContract {
	connect(runner?: ContractRunner | null): IERC20Mintable;
	waitForDeployment(): Promise<this>;
	interface: IERC20MintableInterface;
	queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
	listeners(eventName?: string): Promise<Array<Listener>>;
	removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
	DOMAIN_SEPARATOR: TypedContractMethod<[
	], [
		string
	], "view">;
	allowance: TypedContractMethod<[
		owner: AddressLike,
		spender: AddressLike
	], [
		bigint
	], "view">;
	approve: TypedContractMethod<[
		spender: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	balanceOf: TypedContractMethod<[
		account: AddressLike
	], [
		bigint
	], "view">;
	burn: TypedContractMethod<[
		value: BigNumberish
	], [
		void
	], "nonpayable">;
	burnFrom: TypedContractMethod<[
		account: AddressLike,
		amount: BigNumberish
	], [
		void
	], "nonpayable">;
	decimals: TypedContractMethod<[
	], [
		bigint
	], "view">;
	mint: TypedContractMethod<[
		to: AddressLike,
		amount: BigNumberish
	], [
		void
	], "nonpayable">;
	name: TypedContractMethod<[
	], [
		string
	], "view">;
	nonces: TypedContractMethod<[
		owner: AddressLike
	], [
		bigint
	], "view">;
	permit: TypedContractMethod<[
		owner: AddressLike,
		spender: AddressLike,
		value: BigNumberish,
		deadline: BigNumberish,
		v: BigNumberish,
		r: BytesLike,
		s: BytesLike
	], [
		void
	], "nonpayable">;
	symbol: TypedContractMethod<[
	], [
		string
	], "view">;
	totalSupply: TypedContractMethod<[
	], [
		bigint
	], "view">;
	transfer: TypedContractMethod<[
		to: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	transferFrom: TypedContractMethod<[
		from: AddressLike,
		to: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
	getFunction(nameOrSignature: "DOMAIN_SEPARATOR"): TypedContractMethod<[
	], [
		string
	], "view">;
	getFunction(nameOrSignature: "allowance"): TypedContractMethod<[
		owner: AddressLike,
		spender: AddressLike
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "approve"): TypedContractMethod<[
		spender: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	getFunction(nameOrSignature: "balanceOf"): TypedContractMethod<[
		account: AddressLike
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "burn"): TypedContractMethod<[
		value: BigNumberish
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "burnFrom"): TypedContractMethod<[
		account: AddressLike,
		amount: BigNumberish
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "decimals"): TypedContractMethod<[
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "mint"): TypedContractMethod<[
		to: AddressLike,
		amount: BigNumberish
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "name"): TypedContractMethod<[
	], [
		string
	], "view">;
	getFunction(nameOrSignature: "nonces"): TypedContractMethod<[
		owner: AddressLike
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "permit"): TypedContractMethod<[
		owner: AddressLike,
		spender: AddressLike,
		value: BigNumberish,
		deadline: BigNumberish,
		v: BigNumberish,
		r: BytesLike,
		s: BytesLike
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "symbol"): TypedContractMethod<[
	], [
		string
	], "view">;
	getFunction(nameOrSignature: "totalSupply"): TypedContractMethod<[
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "transfer"): TypedContractMethod<[
		to: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	getFunction(nameOrSignature: "transferFrom"): TypedContractMethod<[
		from: AddressLike,
		to: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	getEvent(key: "Approval"): TypedContractEvent<ApprovalEvent$7.InputTuple, ApprovalEvent$7.OutputTuple, ApprovalEvent$7.OutputObject>;
	getEvent(key: "Transfer"): TypedContractEvent<TransferEvent$7.InputTuple, TransferEvent$7.OutputTuple, TransferEvent$7.OutputObject>;
	filters: {
		"Approval(address,address,uint256)": TypedContractEvent<ApprovalEvent$7.InputTuple, ApprovalEvent$7.OutputTuple, ApprovalEvent$7.OutputObject>;
		Approval: TypedContractEvent<ApprovalEvent$7.InputTuple, ApprovalEvent$7.OutputTuple, ApprovalEvent$7.OutputObject>;
		"Transfer(address,address,uint256)": TypedContractEvent<TransferEvent$7.InputTuple, TransferEvent$7.OutputTuple, TransferEvent$7.OutputObject>;
		Transfer: TypedContractEvent<TransferEvent$7.InputTuple, TransferEvent$7.OutputTuple, TransferEvent$7.OutputObject>;
	};
}
export interface IInitializableProxyInterface extends Interface {
	getFunction(nameOrSignature: "admin" | "changeAdmin" | "implementation" | "initializeProxy" | "upgradeToAndCall"): FunctionFragment;
	encodeFunctionData(functionFragment: "admin", values?: undefined): string;
	encodeFunctionData(functionFragment: "changeAdmin", values: [
		AddressLike
	]): string;
	encodeFunctionData(functionFragment: "implementation", values?: undefined): string;
	encodeFunctionData(functionFragment: "initializeProxy", values: [
		AddressLike,
		AddressLike,
		BytesLike
	]): string;
	encodeFunctionData(functionFragment: "upgradeToAndCall", values: [
		AddressLike,
		BytesLike
	]): string;
	decodeFunctionResult(functionFragment: "admin", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "changeAdmin", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "implementation", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "initializeProxy", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "upgradeToAndCall", data: BytesLike): Result;
}
export interface IInitializableProxy extends BaseContract {
	connect(runner?: ContractRunner | null): IInitializableProxy;
	waitForDeployment(): Promise<this>;
	interface: IInitializableProxyInterface;
	queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
	listeners(eventName?: string): Promise<Array<Listener>>;
	removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
	admin: TypedContractMethod<[
	], [
		string
	], "nonpayable">;
	changeAdmin: TypedContractMethod<[
		newAdmin: AddressLike
	], [
		void
	], "nonpayable">;
	implementation: TypedContractMethod<[
	], [
		string
	], "nonpayable">;
	initializeProxy: TypedContractMethod<[
		newAdmin: AddressLike,
		newImplementation: AddressLike,
		data: BytesLike
	], [
		void
	], "payable">;
	upgradeToAndCall: TypedContractMethod<[
		newImplementation: AddressLike,
		data: BytesLike
	], [
		void
	], "payable">;
	getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
	getFunction(nameOrSignature: "admin"): TypedContractMethod<[
	], [
		string
	], "nonpayable">;
	getFunction(nameOrSignature: "changeAdmin"): TypedContractMethod<[
		newAdmin: AddressLike
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "implementation"): TypedContractMethod<[
	], [
		string
	], "nonpayable">;
	getFunction(nameOrSignature: "initializeProxy"): TypedContractMethod<[
		newAdmin: AddressLike,
		newImplementation: AddressLike,
		data: BytesLike
	], [
		void
	], "payable">;
	getFunction(nameOrSignature: "upgradeToAndCall"): TypedContractMethod<[
		newImplementation: AddressLike,
		data: BytesLike
	], [
		void
	], "payable">;
	filters: {};
}
export interface IPriceFeedInterface extends Interface {
	getFunction(nameOrSignature: "decimals" | "getTokenType" | "latestAnswer" | "latestRound"): FunctionFragment;
	encodeFunctionData(functionFragment: "decimals", values?: undefined): string;
	encodeFunctionData(functionFragment: "getTokenType", values?: undefined): string;
	encodeFunctionData(functionFragment: "latestAnswer", values?: undefined): string;
	encodeFunctionData(functionFragment: "latestRound", values?: undefined): string;
	decodeFunctionResult(functionFragment: "decimals", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "getTokenType", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "latestAnswer", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "latestRound", data: BytesLike): Result;
}
export interface IPriceFeed extends BaseContract {
	connect(runner?: ContractRunner | null): IPriceFeed;
	waitForDeployment(): Promise<this>;
	interface: IPriceFeedInterface;
	queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
	listeners(eventName?: string): Promise<Array<Listener>>;
	removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
	decimals: TypedContractMethod<[
	], [
		bigint
	], "view">;
	getTokenType: TypedContractMethod<[
	], [
		bigint
	], "view">;
	latestAnswer: TypedContractMethod<[
	], [
		bigint
	], "view">;
	latestRound: TypedContractMethod<[
	], [
		bigint
	], "view">;
	getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
	getFunction(nameOrSignature: "decimals"): TypedContractMethod<[
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "getTokenType"): TypedContractMethod<[
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "latestAnswer"): TypedContractMethod<[
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "latestRound"): TypedContractMethod<[
	], [
		bigint
	], "view">;
	filters: {};
}
export interface SigLibInterface extends Interface {
}
export interface SigLib extends BaseContract {
	connect(runner?: ContractRunner | null): SigLib;
	waitForDeployment(): Promise<this>;
	interface: SigLibInterface;
	queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
	listeners(eventName?: string): Promise<Array<Listener>>;
	removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
	getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
	filters: {};
}
export interface WithSettlerInterface extends Interface {
	getFunction(nameOrSignature: "addSettler" | "initialize" | "owner" | "removeSettler" | "renounceOwnership" | "settlers" | "transferOwnership"): FunctionFragment;
	getEvent(nameOrSignatureOrTopic: "AddSettler" | "Initialized" | "OwnershipTransferred" | "RemoveSettler"): EventFragment;
	encodeFunctionData(functionFragment: "addSettler", values: [
		AddressLike
	]): string;
	encodeFunctionData(functionFragment: "initialize", values: [
		AddressLike
	]): string;
	encodeFunctionData(functionFragment: "owner", values?: undefined): string;
	encodeFunctionData(functionFragment: "removeSettler", values: [
		AddressLike
	]): string;
	encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
	encodeFunctionData(functionFragment: "settlers", values?: undefined): string;
	encodeFunctionData(functionFragment: "transferOwnership", values: [
		AddressLike
	]): string;
	decodeFunctionResult(functionFragment: "addSettler", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "removeSettler", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "settlers", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
}
declare namespace AddSettlerEvent$1 {
	type InputTuple = [
		newSettler: AddressLike
	];
	type OutputTuple = [
		newSettler: string
	];
	interface OutputObject {
		newSettler: string;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
declare namespace InitializedEvent$4 {
	type InputTuple = [
		version: BigNumberish
	];
	type OutputTuple = [
		version: bigint
	];
	interface OutputObject {
		version: bigint;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
declare namespace OwnershipTransferredEvent$3 {
	type InputTuple = [
		previousOwner: AddressLike,
		newOwner: AddressLike
	];
	type OutputTuple = [
		previousOwner: string,
		newOwner: string
	];
	interface OutputObject {
		previousOwner: string;
		newOwner: string;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
declare namespace RemoveSettlerEvent$1 {
	type InputTuple = [
		oldSettler: AddressLike
	];
	type OutputTuple = [
		oldSettler: string
	];
	interface OutputObject {
		oldSettler: string;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
export interface WithSettler extends BaseContract {
	connect(runner?: ContractRunner | null): WithSettler;
	waitForDeployment(): Promise<this>;
	interface: WithSettlerInterface;
	queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
	listeners(eventName?: string): Promise<Array<Listener>>;
	removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
	addSettler: TypedContractMethod<[
		_settler: AddressLike
	], [
		void
	], "nonpayable">;
	initialize: TypedContractMethod<[
		_initOwner: AddressLike
	], [
		void
	], "nonpayable">;
	owner: TypedContractMethod<[
	], [
		string
	], "view">;
	removeSettler: TypedContractMethod<[
		_settler: AddressLike
	], [
		void
	], "nonpayable">;
	renounceOwnership: TypedContractMethod<[
	], [
		void
	], "nonpayable">;
	settlers: TypedContractMethod<[
	], [
		string[]
	], "view">;
	transferOwnership: TypedContractMethod<[
		newOwner: AddressLike
	], [
		void
	], "nonpayable">;
	getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
	getFunction(nameOrSignature: "addSettler"): TypedContractMethod<[
		_settler: AddressLike
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "initialize"): TypedContractMethod<[
		_initOwner: AddressLike
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "owner"): TypedContractMethod<[
	], [
		string
	], "view">;
	getFunction(nameOrSignature: "removeSettler"): TypedContractMethod<[
		_settler: AddressLike
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "renounceOwnership"): TypedContractMethod<[
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "settlers"): TypedContractMethod<[
	], [
		string[]
	], "view">;
	getFunction(nameOrSignature: "transferOwnership"): TypedContractMethod<[
		newOwner: AddressLike
	], [
		void
	], "nonpayable">;
	getEvent(key: "AddSettler"): TypedContractEvent<AddSettlerEvent$1.InputTuple, AddSettlerEvent$1.OutputTuple, AddSettlerEvent$1.OutputObject>;
	getEvent(key: "Initialized"): TypedContractEvent<InitializedEvent$4.InputTuple, InitializedEvent$4.OutputTuple, InitializedEvent$4.OutputObject>;
	getEvent(key: "OwnershipTransferred"): TypedContractEvent<OwnershipTransferredEvent$3.InputTuple, OwnershipTransferredEvent$3.OutputTuple, OwnershipTransferredEvent$3.OutputObject>;
	getEvent(key: "RemoveSettler"): TypedContractEvent<RemoveSettlerEvent$1.InputTuple, RemoveSettlerEvent$1.OutputTuple, RemoveSettlerEvent$1.OutputObject>;
	filters: {
		"AddSettler(address)": TypedContractEvent<AddSettlerEvent$1.InputTuple, AddSettlerEvent$1.OutputTuple, AddSettlerEvent$1.OutputObject>;
		AddSettler: TypedContractEvent<AddSettlerEvent$1.InputTuple, AddSettlerEvent$1.OutputTuple, AddSettlerEvent$1.OutputObject>;
		"Initialized(uint64)": TypedContractEvent<InitializedEvent$4.InputTuple, InitializedEvent$4.OutputTuple, InitializedEvent$4.OutputObject>;
		Initialized: TypedContractEvent<InitializedEvent$4.InputTuple, InitializedEvent$4.OutputTuple, InitializedEvent$4.OutputObject>;
		"OwnershipTransferred(address,address)": TypedContractEvent<OwnershipTransferredEvent$3.InputTuple, OwnershipTransferredEvent$3.OutputTuple, OwnershipTransferredEvent$3.OutputObject>;
		OwnershipTransferred: TypedContractEvent<OwnershipTransferredEvent$3.InputTuple, OwnershipTransferredEvent$3.OutputTuple, OwnershipTransferredEvent$3.OutputObject>;
		"RemoveSettler(address)": TypedContractEvent<RemoveSettlerEvent$1.InputTuple, RemoveSettlerEvent$1.OutputTuple, RemoveSettlerEvent$1.OutputObject>;
		RemoveSettler: TypedContractEvent<RemoveSettlerEvent$1.InputTuple, RemoveSettlerEvent$1.OutputTuple, RemoveSettlerEvent$1.OutputObject>;
	};
}
export interface DataFeedInterface extends Interface {
	getFunction(nameOrSignature: "addSettler" | "asset" | "decimals" | "deploymentTimestamp" | "description" | "getAnswer" | "getRoundData" | "getTimestamp" | "getTimestampAnswer" | "initialize" | "latestAnswer" | "latestRound" | "latestRoundData" | "latestTimestamp" | "owner" | "removeSettler" | "renounceOwnership" | "setAsset" | "setDescription" | "setFeedInfo" | "setVersion" | "settlers" | "transferOwnership" | "updateAnswer" | "version"): FunctionFragment;
	getEvent(nameOrSignatureOrTopic: "AddSettler" | "AnswerUpdated" | "Initialized" | "NewAsset" | "NewDescription" | "NewRound" | "OwnershipTransferred" | "RemoveSettler"): EventFragment;
	encodeFunctionData(functionFragment: "addSettler", values: [
		AddressLike
	]): string;
	encodeFunctionData(functionFragment: "asset", values?: undefined): string;
	encodeFunctionData(functionFragment: "decimals", values?: undefined): string;
	encodeFunctionData(functionFragment: "deploymentTimestamp", values?: undefined): string;
	encodeFunctionData(functionFragment: "description", values?: undefined): string;
	encodeFunctionData(functionFragment: "getAnswer", values: [
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "getRoundData", values: [
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "getTimestamp", values: [
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "getTimestampAnswer", values: [
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "initialize", values: [
		AddressLike
	]): string;
	encodeFunctionData(functionFragment: "latestAnswer", values?: undefined): string;
	encodeFunctionData(functionFragment: "latestRound", values?: undefined): string;
	encodeFunctionData(functionFragment: "latestRoundData", values?: undefined): string;
	encodeFunctionData(functionFragment: "latestTimestamp", values?: undefined): string;
	encodeFunctionData(functionFragment: "owner", values?: undefined): string;
	encodeFunctionData(functionFragment: "removeSettler", values: [
		AddressLike
	]): string;
	encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
	encodeFunctionData(functionFragment: "setAsset", values: [
		AddressLike
	]): string;
	encodeFunctionData(functionFragment: "setDescription", values: [
		string
	]): string;
	encodeFunctionData(functionFragment: "setFeedInfo", values: [
		AddressLike,
		string
	]): string;
	encodeFunctionData(functionFragment: "setVersion", values: [
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "settlers", values?: undefined): string;
	encodeFunctionData(functionFragment: "transferOwnership", values: [
		AddressLike
	]): string;
	encodeFunctionData(functionFragment: "updateAnswer", values: [
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "version", values?: undefined): string;
	decodeFunctionResult(functionFragment: "addSettler", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "asset", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "decimals", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "deploymentTimestamp", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "description", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "getAnswer", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "getRoundData", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "getTimestamp", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "getTimestampAnswer", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "latestAnswer", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "latestRound", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "latestRoundData", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "latestTimestamp", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "removeSettler", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "setAsset", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "setDescription", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "setFeedInfo", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "setVersion", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "settlers", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "updateAnswer", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "version", data: BytesLike): Result;
}
declare namespace AddSettlerEvent$2 {
	type InputTuple = [
		newSettler: AddressLike
	];
	type OutputTuple = [
		newSettler: string
	];
	interface OutputObject {
		newSettler: string;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
declare namespace AnswerUpdatedEvent {
	type InputTuple = [
		current: BigNumberish,
		roundId: BigNumberish,
		updatedAt: BigNumberish
	];
	type OutputTuple = [
		current: bigint,
		roundId: bigint,
		updatedAt: bigint
	];
	interface OutputObject {
		current: bigint;
		roundId: bigint;
		updatedAt: bigint;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
declare namespace InitializedEvent$5 {
	type InputTuple = [
		version: BigNumberish
	];
	type OutputTuple = [
		version: bigint
	];
	interface OutputObject {
		version: bigint;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
declare namespace NewAssetEvent {
	type InputTuple = [
		asset: AddressLike
	];
	type OutputTuple = [
		asset: string
	];
	interface OutputObject {
		asset: string;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
declare namespace NewDescriptionEvent {
	type InputTuple = [
		description: string
	];
	type OutputTuple = [
		description: string
	];
	interface OutputObject {
		description: string;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
declare namespace NewRoundEvent {
	type InputTuple = [
		roundId: BigNumberish,
		startedBy: AddressLike,
		startedAt: BigNumberish
	];
	type OutputTuple = [
		roundId: bigint,
		startedBy: string,
		startedAt: bigint
	];
	interface OutputObject {
		roundId: bigint;
		startedBy: string;
		startedAt: bigint;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
declare namespace OwnershipTransferredEvent$4 {
	type InputTuple = [
		previousOwner: AddressLike,
		newOwner: AddressLike
	];
	type OutputTuple = [
		previousOwner: string,
		newOwner: string
	];
	interface OutputObject {
		previousOwner: string;
		newOwner: string;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
declare namespace RemoveSettlerEvent$2 {
	type InputTuple = [
		oldSettler: AddressLike
	];
	type OutputTuple = [
		oldSettler: string
	];
	interface OutputObject {
		oldSettler: string;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
export interface DataFeed extends BaseContract {
	connect(runner?: ContractRunner | null): DataFeed;
	waitForDeployment(): Promise<this>;
	interface: DataFeedInterface;
	queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
	listeners(eventName?: string): Promise<Array<Listener>>;
	removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
	addSettler: TypedContractMethod<[
		_settler: AddressLike
	], [
		void
	], "nonpayable">;
	asset: TypedContractMethod<[
	], [
		string
	], "view">;
	decimals: TypedContractMethod<[
	], [
		bigint
	], "view">;
	deploymentTimestamp: TypedContractMethod<[
	], [
		bigint
	], "view">;
	description: TypedContractMethod<[
	], [
		string
	], "view">;
	getAnswer: TypedContractMethod<[
		arg0: BigNumberish
	], [
		bigint
	], "view">;
	getRoundData: TypedContractMethod<[
		_roundId: BigNumberish
	], [
		[
			bigint,
			bigint,
			bigint,
			bigint,
			bigint
		] & {
			roundId: bigint;
			answer: bigint;
			startedAt: bigint;
			updatedAt: bigint;
			answeredInRound: bigint;
		}
	], "view">;
	getTimestamp: TypedContractMethod<[
		arg0: BigNumberish
	], [
		bigint
	], "view">;
	getTimestampAnswer: TypedContractMethod<[
		arg0: BigNumberish
	], [
		bigint
	], "view">;
	initialize: TypedContractMethod<[
		_initOwner: AddressLike
	], [
		void
	], "nonpayable">;
	latestAnswer: TypedContractMethod<[
	], [
		bigint
	], "view">;
	latestRound: TypedContractMethod<[
	], [
		bigint
	], "view">;
	latestRoundData: TypedContractMethod<[
	], [
		[
			bigint,
			bigint,
			bigint,
			bigint,
			bigint
		]
	], "view">;
	latestTimestamp: TypedContractMethod<[
	], [
		bigint
	], "view">;
	owner: TypedContractMethod<[
	], [
		string
	], "view">;
	removeSettler: TypedContractMethod<[
		_settler: AddressLike
	], [
		void
	], "nonpayable">;
	renounceOwnership: TypedContractMethod<[
	], [
		void
	], "nonpayable">;
	setAsset: TypedContractMethod<[
		_asset: AddressLike
	], [
		void
	], "nonpayable">;
	setDescription: TypedContractMethod<[
		_description: string
	], [
		void
	], "nonpayable">;
	setFeedInfo: TypedContractMethod<[
		_asset: AddressLike,
		_description: string
	], [
		void
	], "nonpayable">;
	setVersion: TypedContractMethod<[
		_version: BigNumberish
	], [
		void
	], "nonpayable">;
	settlers: TypedContractMethod<[
	], [
		string[]
	], "view">;
	transferOwnership: TypedContractMethod<[
		newOwner: AddressLike
	], [
		void
	], "nonpayable">;
	updateAnswer: TypedContractMethod<[
		newAnswer: BigNumberish
	], [
		void
	], "nonpayable">;
	version: TypedContractMethod<[
	], [
		bigint
	], "view">;
	getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
	getFunction(nameOrSignature: "addSettler"): TypedContractMethod<[
		_settler: AddressLike
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "asset"): TypedContractMethod<[
	], [
		string
	], "view">;
	getFunction(nameOrSignature: "decimals"): TypedContractMethod<[
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "deploymentTimestamp"): TypedContractMethod<[
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "description"): TypedContractMethod<[
	], [
		string
	], "view">;
	getFunction(nameOrSignature: "getAnswer"): TypedContractMethod<[
		arg0: BigNumberish
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "getRoundData"): TypedContractMethod<[
		_roundId: BigNumberish
	], [
		[
			bigint,
			bigint,
			bigint,
			bigint,
			bigint
		] & {
			roundId: bigint;
			answer: bigint;
			startedAt: bigint;
			updatedAt: bigint;
			answeredInRound: bigint;
		}
	], "view">;
	getFunction(nameOrSignature: "getTimestamp"): TypedContractMethod<[
		arg0: BigNumberish
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "getTimestampAnswer"): TypedContractMethod<[
		arg0: BigNumberish
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "initialize"): TypedContractMethod<[
		_initOwner: AddressLike
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "latestAnswer"): TypedContractMethod<[
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "latestRound"): TypedContractMethod<[
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "latestRoundData"): TypedContractMethod<[
	], [
		[
			bigint,
			bigint,
			bigint,
			bigint,
			bigint
		]
	], "view">;
	getFunction(nameOrSignature: "latestTimestamp"): TypedContractMethod<[
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "owner"): TypedContractMethod<[
	], [
		string
	], "view">;
	getFunction(nameOrSignature: "removeSettler"): TypedContractMethod<[
		_settler: AddressLike
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "renounceOwnership"): TypedContractMethod<[
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "setAsset"): TypedContractMethod<[
		_asset: AddressLike
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "setDescription"): TypedContractMethod<[
		_description: string
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "setFeedInfo"): TypedContractMethod<[
		_asset: AddressLike,
		_description: string
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "setVersion"): TypedContractMethod<[
		_version: BigNumberish
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "settlers"): TypedContractMethod<[
	], [
		string[]
	], "view">;
	getFunction(nameOrSignature: "transferOwnership"): TypedContractMethod<[
		newOwner: AddressLike
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "updateAnswer"): TypedContractMethod<[
		newAnswer: BigNumberish
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "version"): TypedContractMethod<[
	], [
		bigint
	], "view">;
	getEvent(key: "AddSettler"): TypedContractEvent<AddSettlerEvent$2.InputTuple, AddSettlerEvent$2.OutputTuple, AddSettlerEvent$2.OutputObject>;
	getEvent(key: "AnswerUpdated"): TypedContractEvent<AnswerUpdatedEvent.InputTuple, AnswerUpdatedEvent.OutputTuple, AnswerUpdatedEvent.OutputObject>;
	getEvent(key: "Initialized"): TypedContractEvent<InitializedEvent$5.InputTuple, InitializedEvent$5.OutputTuple, InitializedEvent$5.OutputObject>;
	getEvent(key: "NewAsset"): TypedContractEvent<NewAssetEvent.InputTuple, NewAssetEvent.OutputTuple, NewAssetEvent.OutputObject>;
	getEvent(key: "NewDescription"): TypedContractEvent<NewDescriptionEvent.InputTuple, NewDescriptionEvent.OutputTuple, NewDescriptionEvent.OutputObject>;
	getEvent(key: "NewRound"): TypedContractEvent<NewRoundEvent.InputTuple, NewRoundEvent.OutputTuple, NewRoundEvent.OutputObject>;
	getEvent(key: "OwnershipTransferred"): TypedContractEvent<OwnershipTransferredEvent$4.InputTuple, OwnershipTransferredEvent$4.OutputTuple, OwnershipTransferredEvent$4.OutputObject>;
	getEvent(key: "RemoveSettler"): TypedContractEvent<RemoveSettlerEvent$2.InputTuple, RemoveSettlerEvent$2.OutputTuple, RemoveSettlerEvent$2.OutputObject>;
	filters: {
		"AddSettler(address)": TypedContractEvent<AddSettlerEvent$2.InputTuple, AddSettlerEvent$2.OutputTuple, AddSettlerEvent$2.OutputObject>;
		AddSettler: TypedContractEvent<AddSettlerEvent$2.InputTuple, AddSettlerEvent$2.OutputTuple, AddSettlerEvent$2.OutputObject>;
		"AnswerUpdated(int256,uint256,uint256)": TypedContractEvent<AnswerUpdatedEvent.InputTuple, AnswerUpdatedEvent.OutputTuple, AnswerUpdatedEvent.OutputObject>;
		AnswerUpdated: TypedContractEvent<AnswerUpdatedEvent.InputTuple, AnswerUpdatedEvent.OutputTuple, AnswerUpdatedEvent.OutputObject>;
		"Initialized(uint64)": TypedContractEvent<InitializedEvent$5.InputTuple, InitializedEvent$5.OutputTuple, InitializedEvent$5.OutputObject>;
		Initialized: TypedContractEvent<InitializedEvent$5.InputTuple, InitializedEvent$5.OutputTuple, InitializedEvent$5.OutputObject>;
		"NewAsset(address)": TypedContractEvent<NewAssetEvent.InputTuple, NewAssetEvent.OutputTuple, NewAssetEvent.OutputObject>;
		NewAsset: TypedContractEvent<NewAssetEvent.InputTuple, NewAssetEvent.OutputTuple, NewAssetEvent.OutputObject>;
		"NewDescription(string)": TypedContractEvent<NewDescriptionEvent.InputTuple, NewDescriptionEvent.OutputTuple, NewDescriptionEvent.OutputObject>;
		NewDescription: TypedContractEvent<NewDescriptionEvent.InputTuple, NewDescriptionEvent.OutputTuple, NewDescriptionEvent.OutputObject>;
		"NewRound(uint256,address,uint256)": TypedContractEvent<NewRoundEvent.InputTuple, NewRoundEvent.OutputTuple, NewRoundEvent.OutputObject>;
		NewRound: TypedContractEvent<NewRoundEvent.InputTuple, NewRoundEvent.OutputTuple, NewRoundEvent.OutputObject>;
		"OwnershipTransferred(address,address)": TypedContractEvent<OwnershipTransferredEvent$4.InputTuple, OwnershipTransferredEvent$4.OutputTuple, OwnershipTransferredEvent$4.OutputObject>;
		OwnershipTransferred: TypedContractEvent<OwnershipTransferredEvent$4.InputTuple, OwnershipTransferredEvent$4.OutputTuple, OwnershipTransferredEvent$4.OutputObject>;
		"RemoveSettler(address)": TypedContractEvent<RemoveSettlerEvent$2.InputTuple, RemoveSettlerEvent$2.OutputTuple, RemoveSettlerEvent$2.OutputObject>;
		RemoveSettler: TypedContractEvent<RemoveSettlerEvent$2.InputTuple, RemoveSettlerEvent$2.OutputTuple, RemoveSettlerEvent$2.OutputObject>;
	};
}
export interface InitializableProxyInterface extends Interface {
	getFunction(nameOrSignature: "admin" | "changeAdmin" | "implementation" | "initializeProxy" | "upgradeToAndCall"): FunctionFragment;
	getEvent(nameOrSignatureOrTopic: "AdminChanged" | "Upgraded"): EventFragment;
	encodeFunctionData(functionFragment: "admin", values?: undefined): string;
	encodeFunctionData(functionFragment: "changeAdmin", values: [
		AddressLike
	]): string;
	encodeFunctionData(functionFragment: "implementation", values?: undefined): string;
	encodeFunctionData(functionFragment: "initializeProxy", values: [
		AddressLike,
		AddressLike,
		BytesLike
	]): string;
	encodeFunctionData(functionFragment: "upgradeToAndCall", values: [
		AddressLike,
		BytesLike
	]): string;
	decodeFunctionResult(functionFragment: "admin", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "changeAdmin", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "implementation", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "initializeProxy", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "upgradeToAndCall", data: BytesLike): Result;
}
declare namespace AdminChangedEvent$1 {
	type InputTuple = [
		previousAdmin: AddressLike,
		newAdmin: AddressLike
	];
	type OutputTuple = [
		previousAdmin: string,
		newAdmin: string
	];
	interface OutputObject {
		previousAdmin: string;
		newAdmin: string;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
declare namespace UpgradedEvent$1 {
	type InputTuple = [
		implementation: AddressLike
	];
	type OutputTuple = [
		implementation: string
	];
	interface OutputObject {
		implementation: string;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
export interface InitializableProxy extends BaseContract {
	connect(runner?: ContractRunner | null): InitializableProxy;
	waitForDeployment(): Promise<this>;
	interface: InitializableProxyInterface;
	queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
	listeners(eventName?: string): Promise<Array<Listener>>;
	removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
	admin: TypedContractMethod<[
	], [
		string
	], "view">;
	changeAdmin: TypedContractMethod<[
		newAdmin: AddressLike
	], [
		void
	], "nonpayable">;
	implementation: TypedContractMethod<[
	], [
		string
	], "view">;
	initializeProxy: TypedContractMethod<[
		newAdmin: AddressLike,
		newImplementation: AddressLike,
		data: BytesLike
	], [
		void
	], "payable">;
	upgradeToAndCall: TypedContractMethod<[
		newImplementation: AddressLike,
		data: BytesLike
	], [
		void
	], "payable">;
	getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
	getFunction(nameOrSignature: "admin"): TypedContractMethod<[
	], [
		string
	], "view">;
	getFunction(nameOrSignature: "changeAdmin"): TypedContractMethod<[
		newAdmin: AddressLike
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "implementation"): TypedContractMethod<[
	], [
		string
	], "view">;
	getFunction(nameOrSignature: "initializeProxy"): TypedContractMethod<[
		newAdmin: AddressLike,
		newImplementation: AddressLike,
		data: BytesLike
	], [
		void
	], "payable">;
	getFunction(nameOrSignature: "upgradeToAndCall"): TypedContractMethod<[
		newImplementation: AddressLike,
		data: BytesLike
	], [
		void
	], "payable">;
	getEvent(key: "AdminChanged"): TypedContractEvent<AdminChangedEvent$1.InputTuple, AdminChangedEvent$1.OutputTuple, AdminChangedEvent$1.OutputObject>;
	getEvent(key: "Upgraded"): TypedContractEvent<UpgradedEvent$1.InputTuple, UpgradedEvent$1.OutputTuple, UpgradedEvent$1.OutputObject>;
	filters: {
		"AdminChanged(address,address)": TypedContractEvent<AdminChangedEvent$1.InputTuple, AdminChangedEvent$1.OutputTuple, AdminChangedEvent$1.OutputObject>;
		AdminChanged: TypedContractEvent<AdminChangedEvent$1.InputTuple, AdminChangedEvent$1.OutputTuple, AdminChangedEvent$1.OutputObject>;
		"Upgraded(address)": TypedContractEvent<UpgradedEvent$1.InputTuple, UpgradedEvent$1.OutputTuple, UpgradedEvent$1.OutputObject>;
		Upgraded: TypedContractEvent<UpgradedEvent$1.InputTuple, UpgradedEvent$1.OutputTuple, UpgradedEvent$1.OutputObject>;
	};
}
export interface ERC20MockInterface extends Interface {
	getFunction(nameOrSignature: "DOMAIN_SEPARATOR" | "allowance" | "approve" | "balanceOf" | "burn" | "burnFrom" | "decimals" | "eip712Domain" | "mint(address,uint256)" | "mint(uint256)" | "name" | "nonces" | "owner" | "permit" | "renounceOwnership" | "symbol" | "totalSupply" | "transfer" | "transferFrom" | "transferOwnership"): FunctionFragment;
	getEvent(nameOrSignatureOrTopic: "Approval" | "EIP712DomainChanged" | "OwnershipTransferred" | "Transfer"): EventFragment;
	encodeFunctionData(functionFragment: "DOMAIN_SEPARATOR", values?: undefined): string;
	encodeFunctionData(functionFragment: "allowance", values: [
		AddressLike,
		AddressLike
	]): string;
	encodeFunctionData(functionFragment: "approve", values: [
		AddressLike,
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "balanceOf", values: [
		AddressLike
	]): string;
	encodeFunctionData(functionFragment: "burn", values: [
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "burnFrom", values: [
		AddressLike,
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "decimals", values?: undefined): string;
	encodeFunctionData(functionFragment: "eip712Domain", values?: undefined): string;
	encodeFunctionData(functionFragment: "mint(address,uint256)", values: [
		AddressLike,
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "mint(uint256)", values: [
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "name", values?: undefined): string;
	encodeFunctionData(functionFragment: "nonces", values: [
		AddressLike
	]): string;
	encodeFunctionData(functionFragment: "owner", values?: undefined): string;
	encodeFunctionData(functionFragment: "permit", values: [
		AddressLike,
		AddressLike,
		BigNumberish,
		BigNumberish,
		BigNumberish,
		BytesLike,
		BytesLike
	]): string;
	encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
	encodeFunctionData(functionFragment: "symbol", values?: undefined): string;
	encodeFunctionData(functionFragment: "totalSupply", values?: undefined): string;
	encodeFunctionData(functionFragment: "transfer", values: [
		AddressLike,
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "transferFrom", values: [
		AddressLike,
		AddressLike,
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "transferOwnership", values: [
		AddressLike
	]): string;
	decodeFunctionResult(functionFragment: "DOMAIN_SEPARATOR", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "allowance", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "burn", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "burnFrom", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "decimals", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "eip712Domain", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "mint(address,uint256)", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "mint(uint256)", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "nonces", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "permit", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "symbol", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "totalSupply", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "transfer", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "transferFrom", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
}
declare namespace ApprovalEvent$8 {
	type InputTuple = [
		owner: AddressLike,
		spender: AddressLike,
		value: BigNumberish
	];
	type OutputTuple = [
		owner: string,
		spender: string,
		value: bigint
	];
	interface OutputObject {
		owner: string;
		spender: string;
		value: bigint;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
declare namespace EIP712DomainChangedEvent$3 {
	type InputTuple = [
	];
	type OutputTuple = [
	];
	interface OutputObject {
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
declare namespace OwnershipTransferredEvent$5 {
	type InputTuple = [
		previousOwner: AddressLike,
		newOwner: AddressLike
	];
	type OutputTuple = [
		previousOwner: string,
		newOwner: string
	];
	interface OutputObject {
		previousOwner: string;
		newOwner: string;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
declare namespace TransferEvent$8 {
	type InputTuple = [
		from: AddressLike,
		to: AddressLike,
		value: BigNumberish
	];
	type OutputTuple = [
		from: string,
		to: string,
		value: bigint
	];
	interface OutputObject {
		from: string;
		to: string;
		value: bigint;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
export interface ERC20Mock extends BaseContract {
	connect(runner?: ContractRunner | null): ERC20Mock;
	waitForDeployment(): Promise<this>;
	interface: ERC20MockInterface;
	queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
	listeners(eventName?: string): Promise<Array<Listener>>;
	removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
	DOMAIN_SEPARATOR: TypedContractMethod<[
	], [
		string
	], "view">;
	allowance: TypedContractMethod<[
		owner: AddressLike,
		spender: AddressLike
	], [
		bigint
	], "view">;
	approve: TypedContractMethod<[
		spender: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	balanceOf: TypedContractMethod<[
		account: AddressLike
	], [
		bigint
	], "view">;
	burn: TypedContractMethod<[
		value: BigNumberish
	], [
		void
	], "nonpayable">;
	burnFrom: TypedContractMethod<[
		account: AddressLike,
		value: BigNumberish
	], [
		void
	], "nonpayable">;
	decimals: TypedContractMethod<[
	], [
		bigint
	], "view">;
	eip712Domain: TypedContractMethod<[
	], [
		[
			string,
			string,
			string,
			bigint,
			string,
			string,
			bigint[]
		] & {
			fields: string;
			name: string;
			version: string;
			chainId: bigint;
			verifyingContract: string;
			salt: string;
			extensions: bigint[];
		}
	], "view">;
	"mint(address,uint256)": TypedContractMethod<[
		to: AddressLike,
		amount: BigNumberish
	], [
		void
	], "nonpayable">;
	"mint(uint256)": TypedContractMethod<[
		amount: BigNumberish
	], [
		void
	], "nonpayable">;
	name: TypedContractMethod<[
	], [
		string
	], "view">;
	nonces: TypedContractMethod<[
		owner: AddressLike
	], [
		bigint
	], "view">;
	owner: TypedContractMethod<[
	], [
		string
	], "view">;
	permit: TypedContractMethod<[
		owner: AddressLike,
		spender: AddressLike,
		value: BigNumberish,
		deadline: BigNumberish,
		v: BigNumberish,
		r: BytesLike,
		s: BytesLike
	], [
		void
	], "nonpayable">;
	renounceOwnership: TypedContractMethod<[
	], [
		void
	], "nonpayable">;
	symbol: TypedContractMethod<[
	], [
		string
	], "view">;
	totalSupply: TypedContractMethod<[
	], [
		bigint
	], "view">;
	transfer: TypedContractMethod<[
		to: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	transferFrom: TypedContractMethod<[
		from: AddressLike,
		to: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	transferOwnership: TypedContractMethod<[
		newOwner: AddressLike
	], [
		void
	], "nonpayable">;
	getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
	getFunction(nameOrSignature: "DOMAIN_SEPARATOR"): TypedContractMethod<[
	], [
		string
	], "view">;
	getFunction(nameOrSignature: "allowance"): TypedContractMethod<[
		owner: AddressLike,
		spender: AddressLike
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "approve"): TypedContractMethod<[
		spender: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	getFunction(nameOrSignature: "balanceOf"): TypedContractMethod<[
		account: AddressLike
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "burn"): TypedContractMethod<[
		value: BigNumberish
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "burnFrom"): TypedContractMethod<[
		account: AddressLike,
		value: BigNumberish
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "decimals"): TypedContractMethod<[
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "eip712Domain"): TypedContractMethod<[
	], [
		[
			string,
			string,
			string,
			bigint,
			string,
			string,
			bigint[]
		] & {
			fields: string;
			name: string;
			version: string;
			chainId: bigint;
			verifyingContract: string;
			salt: string;
			extensions: bigint[];
		}
	], "view">;
	getFunction(nameOrSignature: "mint(address,uint256)"): TypedContractMethod<[
		to: AddressLike,
		amount: BigNumberish
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "mint(uint256)"): TypedContractMethod<[
		amount: BigNumberish
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "name"): TypedContractMethod<[
	], [
		string
	], "view">;
	getFunction(nameOrSignature: "nonces"): TypedContractMethod<[
		owner: AddressLike
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "owner"): TypedContractMethod<[
	], [
		string
	], "view">;
	getFunction(nameOrSignature: "permit"): TypedContractMethod<[
		owner: AddressLike,
		spender: AddressLike,
		value: BigNumberish,
		deadline: BigNumberish,
		v: BigNumberish,
		r: BytesLike,
		s: BytesLike
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "renounceOwnership"): TypedContractMethod<[
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "symbol"): TypedContractMethod<[
	], [
		string
	], "view">;
	getFunction(nameOrSignature: "totalSupply"): TypedContractMethod<[
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "transfer"): TypedContractMethod<[
		to: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	getFunction(nameOrSignature: "transferFrom"): TypedContractMethod<[
		from: AddressLike,
		to: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	getFunction(nameOrSignature: "transferOwnership"): TypedContractMethod<[
		newOwner: AddressLike
	], [
		void
	], "nonpayable">;
	getEvent(key: "Approval"): TypedContractEvent<ApprovalEvent$8.InputTuple, ApprovalEvent$8.OutputTuple, ApprovalEvent$8.OutputObject>;
	getEvent(key: "EIP712DomainChanged"): TypedContractEvent<EIP712DomainChangedEvent$3.InputTuple, EIP712DomainChangedEvent$3.OutputTuple, EIP712DomainChangedEvent$3.OutputObject>;
	getEvent(key: "OwnershipTransferred"): TypedContractEvent<OwnershipTransferredEvent$5.InputTuple, OwnershipTransferredEvent$5.OutputTuple, OwnershipTransferredEvent$5.OutputObject>;
	getEvent(key: "Transfer"): TypedContractEvent<TransferEvent$8.InputTuple, TransferEvent$8.OutputTuple, TransferEvent$8.OutputObject>;
	filters: {
		"Approval(address,address,uint256)": TypedContractEvent<ApprovalEvent$8.InputTuple, ApprovalEvent$8.OutputTuple, ApprovalEvent$8.OutputObject>;
		Approval: TypedContractEvent<ApprovalEvent$8.InputTuple, ApprovalEvent$8.OutputTuple, ApprovalEvent$8.OutputObject>;
		"EIP712DomainChanged()": TypedContractEvent<EIP712DomainChangedEvent$3.InputTuple, EIP712DomainChangedEvent$3.OutputTuple, EIP712DomainChangedEvent$3.OutputObject>;
		EIP712DomainChanged: TypedContractEvent<EIP712DomainChangedEvent$3.InputTuple, EIP712DomainChangedEvent$3.OutputTuple, EIP712DomainChangedEvent$3.OutputObject>;
		"OwnershipTransferred(address,address)": TypedContractEvent<OwnershipTransferredEvent$5.InputTuple, OwnershipTransferredEvent$5.OutputTuple, OwnershipTransferredEvent$5.OutputObject>;
		OwnershipTransferred: TypedContractEvent<OwnershipTransferredEvent$5.InputTuple, OwnershipTransferredEvent$5.OutputTuple, OwnershipTransferredEvent$5.OutputObject>;
		"Transfer(address,address,uint256)": TypedContractEvent<TransferEvent$8.InputTuple, TransferEvent$8.OutputTuple, TransferEvent$8.OutputObject>;
		Transfer: TypedContractEvent<TransferEvent$8.InputTuple, TransferEvent$8.OutputTuple, TransferEvent$8.OutputObject>;
	};
}
export interface GoldTokenInterface extends Interface {
	getFunction(nameOrSignature: "DOMAIN_SEPARATOR" | "addMinter" | "allowance" | "approve" | "balanceOf" | "burn" | "burnFrom" | "decimals" | "eip712Domain" | "mint(address,uint256)" | "mint(uint256)" | "minters" | "name" | "nonces" | "owner" | "permit" | "removeMinter" | "renounceOwnership" | "symbol" | "totalSupply" | "transfer" | "transferFrom" | "transferOwnership"): FunctionFragment;
	getEvent(nameOrSignatureOrTopic: "AddMinter" | "Approval" | "EIP712DomainChanged" | "OwnershipTransferred" | "RemoveMinter" | "Transfer"): EventFragment;
	encodeFunctionData(functionFragment: "DOMAIN_SEPARATOR", values?: undefined): string;
	encodeFunctionData(functionFragment: "addMinter", values: [
		AddressLike
	]): string;
	encodeFunctionData(functionFragment: "allowance", values: [
		AddressLike,
		AddressLike
	]): string;
	encodeFunctionData(functionFragment: "approve", values: [
		AddressLike,
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "balanceOf", values: [
		AddressLike
	]): string;
	encodeFunctionData(functionFragment: "burn", values: [
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "burnFrom", values: [
		AddressLike,
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "decimals", values?: undefined): string;
	encodeFunctionData(functionFragment: "eip712Domain", values?: undefined): string;
	encodeFunctionData(functionFragment: "mint(address,uint256)", values: [
		AddressLike,
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "mint(uint256)", values: [
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "minters", values?: undefined): string;
	encodeFunctionData(functionFragment: "name", values?: undefined): string;
	encodeFunctionData(functionFragment: "nonces", values: [
		AddressLike
	]): string;
	encodeFunctionData(functionFragment: "owner", values?: undefined): string;
	encodeFunctionData(functionFragment: "permit", values: [
		AddressLike,
		AddressLike,
		BigNumberish,
		BigNumberish,
		BigNumberish,
		BytesLike,
		BytesLike
	]): string;
	encodeFunctionData(functionFragment: "removeMinter", values: [
		AddressLike
	]): string;
	encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
	encodeFunctionData(functionFragment: "symbol", values?: undefined): string;
	encodeFunctionData(functionFragment: "totalSupply", values?: undefined): string;
	encodeFunctionData(functionFragment: "transfer", values: [
		AddressLike,
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "transferFrom", values: [
		AddressLike,
		AddressLike,
		BigNumberish
	]): string;
	encodeFunctionData(functionFragment: "transferOwnership", values: [
		AddressLike
	]): string;
	decodeFunctionResult(functionFragment: "DOMAIN_SEPARATOR", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "addMinter", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "allowance", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "burn", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "burnFrom", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "decimals", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "eip712Domain", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "mint(address,uint256)", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "mint(uint256)", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "minters", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "nonces", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "permit", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "removeMinter", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "symbol", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "totalSupply", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "transfer", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "transferFrom", data: BytesLike): Result;
	decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
}
declare namespace AddMinterEvent {
	type InputTuple = [
		newMinter: AddressLike
	];
	type OutputTuple = [
		newMinter: string
	];
	interface OutputObject {
		newMinter: string;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
declare namespace ApprovalEvent$9 {
	type InputTuple = [
		owner: AddressLike,
		spender: AddressLike,
		value: BigNumberish
	];
	type OutputTuple = [
		owner: string,
		spender: string,
		value: bigint
	];
	interface OutputObject {
		owner: string;
		spender: string;
		value: bigint;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
declare namespace EIP712DomainChangedEvent$4 {
	type InputTuple = [
	];
	type OutputTuple = [
	];
	interface OutputObject {
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
declare namespace OwnershipTransferredEvent$6 {
	type InputTuple = [
		previousOwner: AddressLike,
		newOwner: AddressLike
	];
	type OutputTuple = [
		previousOwner: string,
		newOwner: string
	];
	interface OutputObject {
		previousOwner: string;
		newOwner: string;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
declare namespace RemoveMinterEvent {
	type InputTuple = [
		oldMinter: AddressLike
	];
	type OutputTuple = [
		oldMinter: string
	];
	interface OutputObject {
		oldMinter: string;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
declare namespace TransferEvent$9 {
	type InputTuple = [
		from: AddressLike,
		to: AddressLike,
		value: BigNumberish
	];
	type OutputTuple = [
		from: string,
		to: string,
		value: bigint
	];
	interface OutputObject {
		from: string;
		to: string;
		value: bigint;
	}
	type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	type Filter = TypedDeferredTopicFilter<Event>;
	type Log = TypedEventLog<Event>;
	type LogDescription = TypedLogDescription<Event>;
}
export interface GoldToken extends BaseContract {
	connect(runner?: ContractRunner | null): GoldToken;
	waitForDeployment(): Promise<this>;
	interface: GoldTokenInterface;
	queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
	on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
	once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
	listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
	listeners(eventName?: string): Promise<Array<Listener>>;
	removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
	DOMAIN_SEPARATOR: TypedContractMethod<[
	], [
		string
	], "view">;
	addMinter: TypedContractMethod<[
		_minter: AddressLike
	], [
		void
	], "nonpayable">;
	allowance: TypedContractMethod<[
		owner: AddressLike,
		spender: AddressLike
	], [
		bigint
	], "view">;
	approve: TypedContractMethod<[
		spender: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	balanceOf: TypedContractMethod<[
		account: AddressLike
	], [
		bigint
	], "view">;
	burn: TypedContractMethod<[
		value: BigNumberish
	], [
		void
	], "nonpayable">;
	burnFrom: TypedContractMethod<[
		account: AddressLike,
		value: BigNumberish
	], [
		void
	], "nonpayable">;
	decimals: TypedContractMethod<[
	], [
		bigint
	], "view">;
	eip712Domain: TypedContractMethod<[
	], [
		[
			string,
			string,
			string,
			bigint,
			string,
			string,
			bigint[]
		] & {
			fields: string;
			name: string;
			version: string;
			chainId: bigint;
			verifyingContract: string;
			salt: string;
			extensions: bigint[];
		}
	], "view">;
	"mint(address,uint256)": TypedContractMethod<[
		to: AddressLike,
		amount: BigNumberish
	], [
		void
	], "nonpayable">;
	"mint(uint256)": TypedContractMethod<[
		amount: BigNumberish
	], [
		void
	], "nonpayable">;
	minters: TypedContractMethod<[
	], [
		string[]
	], "view">;
	name: TypedContractMethod<[
	], [
		string
	], "view">;
	nonces: TypedContractMethod<[
		owner: AddressLike
	], [
		bigint
	], "view">;
	owner: TypedContractMethod<[
	], [
		string
	], "view">;
	permit: TypedContractMethod<[
		owner: AddressLike,
		spender: AddressLike,
		value: BigNumberish,
		deadline: BigNumberish,
		v: BigNumberish,
		r: BytesLike,
		s: BytesLike
	], [
		void
	], "nonpayable">;
	removeMinter: TypedContractMethod<[
		_minter: AddressLike
	], [
		void
	], "nonpayable">;
	renounceOwnership: TypedContractMethod<[
	], [
		void
	], "nonpayable">;
	symbol: TypedContractMethod<[
	], [
		string
	], "view">;
	totalSupply: TypedContractMethod<[
	], [
		bigint
	], "view">;
	transfer: TypedContractMethod<[
		to: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	transferFrom: TypedContractMethod<[
		from: AddressLike,
		to: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	transferOwnership: TypedContractMethod<[
		newOwner: AddressLike
	], [
		void
	], "nonpayable">;
	getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
	getFunction(nameOrSignature: "DOMAIN_SEPARATOR"): TypedContractMethod<[
	], [
		string
	], "view">;
	getFunction(nameOrSignature: "addMinter"): TypedContractMethod<[
		_minter: AddressLike
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "allowance"): TypedContractMethod<[
		owner: AddressLike,
		spender: AddressLike
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "approve"): TypedContractMethod<[
		spender: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	getFunction(nameOrSignature: "balanceOf"): TypedContractMethod<[
		account: AddressLike
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "burn"): TypedContractMethod<[
		value: BigNumberish
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "burnFrom"): TypedContractMethod<[
		account: AddressLike,
		value: BigNumberish
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "decimals"): TypedContractMethod<[
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "eip712Domain"): TypedContractMethod<[
	], [
		[
			string,
			string,
			string,
			bigint,
			string,
			string,
			bigint[]
		] & {
			fields: string;
			name: string;
			version: string;
			chainId: bigint;
			verifyingContract: string;
			salt: string;
			extensions: bigint[];
		}
	], "view">;
	getFunction(nameOrSignature: "mint(address,uint256)"): TypedContractMethod<[
		to: AddressLike,
		amount: BigNumberish
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "mint(uint256)"): TypedContractMethod<[
		amount: BigNumberish
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "minters"): TypedContractMethod<[
	], [
		string[]
	], "view">;
	getFunction(nameOrSignature: "name"): TypedContractMethod<[
	], [
		string
	], "view">;
	getFunction(nameOrSignature: "nonces"): TypedContractMethod<[
		owner: AddressLike
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "owner"): TypedContractMethod<[
	], [
		string
	], "view">;
	getFunction(nameOrSignature: "permit"): TypedContractMethod<[
		owner: AddressLike,
		spender: AddressLike,
		value: BigNumberish,
		deadline: BigNumberish,
		v: BigNumberish,
		r: BytesLike,
		s: BytesLike
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "removeMinter"): TypedContractMethod<[
		_minter: AddressLike
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "renounceOwnership"): TypedContractMethod<[
	], [
		void
	], "nonpayable">;
	getFunction(nameOrSignature: "symbol"): TypedContractMethod<[
	], [
		string
	], "view">;
	getFunction(nameOrSignature: "totalSupply"): TypedContractMethod<[
	], [
		bigint
	], "view">;
	getFunction(nameOrSignature: "transfer"): TypedContractMethod<[
		to: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	getFunction(nameOrSignature: "transferFrom"): TypedContractMethod<[
		from: AddressLike,
		to: AddressLike,
		value: BigNumberish
	], [
		boolean
	], "nonpayable">;
	getFunction(nameOrSignature: "transferOwnership"): TypedContractMethod<[
		newOwner: AddressLike
	], [
		void
	], "nonpayable">;
	getEvent(key: "AddMinter"): TypedContractEvent<AddMinterEvent.InputTuple, AddMinterEvent.OutputTuple, AddMinterEvent.OutputObject>;
	getEvent(key: "Approval"): TypedContractEvent<ApprovalEvent$9.InputTuple, ApprovalEvent$9.OutputTuple, ApprovalEvent$9.OutputObject>;
	getEvent(key: "EIP712DomainChanged"): TypedContractEvent<EIP712DomainChangedEvent$4.InputTuple, EIP712DomainChangedEvent$4.OutputTuple, EIP712DomainChangedEvent$4.OutputObject>;
	getEvent(key: "OwnershipTransferred"): TypedContractEvent<OwnershipTransferredEvent$6.InputTuple, OwnershipTransferredEvent$6.OutputTuple, OwnershipTransferredEvent$6.OutputObject>;
	getEvent(key: "RemoveMinter"): TypedContractEvent<RemoveMinterEvent.InputTuple, RemoveMinterEvent.OutputTuple, RemoveMinterEvent.OutputObject>;
	getEvent(key: "Transfer"): TypedContractEvent<TransferEvent$9.InputTuple, TransferEvent$9.OutputTuple, TransferEvent$9.OutputObject>;
	filters: {
		"AddMinter(address)": TypedContractEvent<AddMinterEvent.InputTuple, AddMinterEvent.OutputTuple, AddMinterEvent.OutputObject>;
		AddMinter: TypedContractEvent<AddMinterEvent.InputTuple, AddMinterEvent.OutputTuple, AddMinterEvent.OutputObject>;
		"Approval(address,address,uint256)": TypedContractEvent<ApprovalEvent$9.InputTuple, ApprovalEvent$9.OutputTuple, ApprovalEvent$9.OutputObject>;
		Approval: TypedContractEvent<ApprovalEvent$9.InputTuple, ApprovalEvent$9.OutputTuple, ApprovalEvent$9.OutputObject>;
		"EIP712DomainChanged()": TypedContractEvent<EIP712DomainChangedEvent$4.InputTuple, EIP712DomainChangedEvent$4.OutputTuple, EIP712DomainChangedEvent$4.OutputObject>;
		EIP712DomainChanged: TypedContractEvent<EIP712DomainChangedEvent$4.InputTuple, EIP712DomainChangedEvent$4.OutputTuple, EIP712DomainChangedEvent$4.OutputObject>;
		"OwnershipTransferred(address,address)": TypedContractEvent<OwnershipTransferredEvent$6.InputTuple, OwnershipTransferredEvent$6.OutputTuple, OwnershipTransferredEvent$6.OutputObject>;
		OwnershipTransferred: TypedContractEvent<OwnershipTransferredEvent$6.InputTuple, OwnershipTransferredEvent$6.OutputTuple, OwnershipTransferredEvent$6.OutputObject>;
		"RemoveMinter(address)": TypedContractEvent<RemoveMinterEvent.InputTuple, RemoveMinterEvent.OutputTuple, RemoveMinterEvent.OutputObject>;
		RemoveMinter: TypedContractEvent<RemoveMinterEvent.InputTuple, RemoveMinterEvent.OutputTuple, RemoveMinterEvent.OutputObject>;
		"Transfer(address,address,uint256)": TypedContractEvent<TransferEvent$9.InputTuple, TransferEvent$9.OutputTuple, TransferEvent$9.OutputObject>;
		Transfer: TypedContractEvent<TransferEvent$9.InputTuple, TransferEvent$9.OutputTuple, TransferEvent$9.OutputObject>;
	};
}
export declare class Ownable__factory {
	static readonly abi: readonly [
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "owner";
					readonly type: "address";
				}
			];
			readonly name: "OwnableInvalidOwner";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "account";
					readonly type: "address";
				}
			];
			readonly name: "OwnableUnauthorizedAccount";
			readonly type: "error";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "previousOwner";
					readonly type: "address";
				},
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "newOwner";
					readonly type: "address";
				}
			];
			readonly name: "OwnershipTransferred";
			readonly type: "event";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "owner";
			readonly outputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "";
					readonly type: "address";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "renounceOwnership";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "newOwner";
					readonly type: "address";
				}
			];
			readonly name: "transferOwnership";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		}
	];
	static createInterface(): OwnableInterface;
	static connect(address: string, runner?: ContractRunner | null): Ownable;
}
export declare class IERC1363__factory {
	static readonly abi: readonly [
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "owner";
					readonly type: "address";
				},
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "spender";
					readonly type: "address";
				},
				{
					readonly indexed: false;
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "Approval";
			readonly type: "event";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "from";
					readonly type: "address";
				},
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "to";
					readonly type: "address";
				},
				{
					readonly indexed: false;
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "Transfer";
			readonly type: "event";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "owner";
					readonly type: "address";
				},
				{
					readonly internalType: "address";
					readonly name: "spender";
					readonly type: "address";
				}
			];
			readonly name: "allowance";
			readonly outputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "spender";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "approve";
			readonly outputs: readonly [
				{
					readonly internalType: "bool";
					readonly name: "";
					readonly type: "bool";
				}
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "spender";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "approveAndCall";
			readonly outputs: readonly [
				{
					readonly internalType: "bool";
					readonly name: "";
					readonly type: "bool";
				}
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "spender";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				},
				{
					readonly internalType: "bytes";
					readonly name: "data";
					readonly type: "bytes";
				}
			];
			readonly name: "approveAndCall";
			readonly outputs: readonly [
				{
					readonly internalType: "bool";
					readonly name: "";
					readonly type: "bool";
				}
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "account";
					readonly type: "address";
				}
			];
			readonly name: "balanceOf";
			readonly outputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "bytes4";
					readonly name: "interfaceId";
					readonly type: "bytes4";
				}
			];
			readonly name: "supportsInterface";
			readonly outputs: readonly [
				{
					readonly internalType: "bool";
					readonly name: "";
					readonly type: "bool";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "totalSupply";
			readonly outputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "to";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "transfer";
			readonly outputs: readonly [
				{
					readonly internalType: "bool";
					readonly name: "";
					readonly type: "bool";
				}
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "to";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "transferAndCall";
			readonly outputs: readonly [
				{
					readonly internalType: "bool";
					readonly name: "";
					readonly type: "bool";
				}
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "to";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				},
				{
					readonly internalType: "bytes";
					readonly name: "data";
					readonly type: "bytes";
				}
			];
			readonly name: "transferAndCall";
			readonly outputs: readonly [
				{
					readonly internalType: "bool";
					readonly name: "";
					readonly type: "bool";
				}
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "from";
					readonly type: "address";
				},
				{
					readonly internalType: "address";
					readonly name: "to";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "transferFrom";
			readonly outputs: readonly [
				{
					readonly internalType: "bool";
					readonly name: "";
					readonly type: "bool";
				}
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "from";
					readonly type: "address";
				},
				{
					readonly internalType: "address";
					readonly name: "to";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				},
				{
					readonly internalType: "bytes";
					readonly name: "data";
					readonly type: "bytes";
				}
			];
			readonly name: "transferFromAndCall";
			readonly outputs: readonly [
				{
					readonly internalType: "bool";
					readonly name: "";
					readonly type: "bool";
				}
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "from";
					readonly type: "address";
				},
				{
					readonly internalType: "address";
					readonly name: "to";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "transferFromAndCall";
			readonly outputs: readonly [
				{
					readonly internalType: "bool";
					readonly name: "";
					readonly type: "bool";
				}
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		}
	];
	static createInterface(): IERC1363Interface;
	static connect(address: string, runner?: ContractRunner | null): IERC1363;
}
export declare class IERC1967__factory {
	static readonly abi: readonly [
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: false;
					readonly internalType: "address";
					readonly name: "previousAdmin";
					readonly type: "address";
				},
				{
					readonly indexed: false;
					readonly internalType: "address";
					readonly name: "newAdmin";
					readonly type: "address";
				}
			];
			readonly name: "AdminChanged";
			readonly type: "event";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "beacon";
					readonly type: "address";
				}
			];
			readonly name: "BeaconUpgraded";
			readonly type: "event";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "implementation";
					readonly type: "address";
				}
			];
			readonly name: "Upgraded";
			readonly type: "event";
		}
	];
	static createInterface(): IERC1967Interface;
	static connect(address: string, runner?: ContractRunner | null): IERC1967;
}
export declare class IERC5267__factory {
	static readonly abi: readonly [
		{
			readonly anonymous: false;
			readonly inputs: readonly [
			];
			readonly name: "EIP712DomainChanged";
			readonly type: "event";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "eip712Domain";
			readonly outputs: readonly [
				{
					readonly internalType: "bytes1";
					readonly name: "fields";
					readonly type: "bytes1";
				},
				{
					readonly internalType: "string";
					readonly name: "name";
					readonly type: "string";
				},
				{
					readonly internalType: "string";
					readonly name: "version";
					readonly type: "string";
				},
				{
					readonly internalType: "uint256";
					readonly name: "chainId";
					readonly type: "uint256";
				},
				{
					readonly internalType: "address";
					readonly name: "verifyingContract";
					readonly type: "address";
				},
				{
					readonly internalType: "bytes32";
					readonly name: "salt";
					readonly type: "bytes32";
				},
				{
					readonly internalType: "uint256[]";
					readonly name: "extensions";
					readonly type: "uint256[]";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		}
	];
	static createInterface(): IERC5267Interface;
	static connect(address: string, runner?: ContractRunner | null): IERC5267;
}
export declare class IERC1155Errors__factory {
	static readonly abi: readonly [
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "sender";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "balance";
					readonly type: "uint256";
				},
				{
					readonly internalType: "uint256";
					readonly name: "needed";
					readonly type: "uint256";
				},
				{
					readonly internalType: "uint256";
					readonly name: "tokenId";
					readonly type: "uint256";
				}
			];
			readonly name: "ERC1155InsufficientBalance";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "approver";
					readonly type: "address";
				}
			];
			readonly name: "ERC1155InvalidApprover";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "idsLength";
					readonly type: "uint256";
				},
				{
					readonly internalType: "uint256";
					readonly name: "valuesLength";
					readonly type: "uint256";
				}
			];
			readonly name: "ERC1155InvalidArrayLength";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "operator";
					readonly type: "address";
				}
			];
			readonly name: "ERC1155InvalidOperator";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "receiver";
					readonly type: "address";
				}
			];
			readonly name: "ERC1155InvalidReceiver";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "sender";
					readonly type: "address";
				}
			];
			readonly name: "ERC1155InvalidSender";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "operator";
					readonly type: "address";
				},
				{
					readonly internalType: "address";
					readonly name: "owner";
					readonly type: "address";
				}
			];
			readonly name: "ERC1155MissingApprovalForAll";
			readonly type: "error";
		}
	];
	static createInterface(): IERC1155ErrorsInterface;
	static connect(address: string, runner?: ContractRunner | null): IERC1155Errors;
}
export declare class IERC20Errors__factory {
	static readonly abi: readonly [
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "spender";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "allowance";
					readonly type: "uint256";
				},
				{
					readonly internalType: "uint256";
					readonly name: "needed";
					readonly type: "uint256";
				}
			];
			readonly name: "ERC20InsufficientAllowance";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "sender";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "balance";
					readonly type: "uint256";
				},
				{
					readonly internalType: "uint256";
					readonly name: "needed";
					readonly type: "uint256";
				}
			];
			readonly name: "ERC20InsufficientBalance";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "approver";
					readonly type: "address";
				}
			];
			readonly name: "ERC20InvalidApprover";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "receiver";
					readonly type: "address";
				}
			];
			readonly name: "ERC20InvalidReceiver";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "sender";
					readonly type: "address";
				}
			];
			readonly name: "ERC20InvalidSender";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "spender";
					readonly type: "address";
				}
			];
			readonly name: "ERC20InvalidSpender";
			readonly type: "error";
		}
	];
	static createInterface(): IERC20ErrorsInterface;
	static connect(address: string, runner?: ContractRunner | null): IERC20Errors;
}
export declare class IERC721Errors__factory {
	static readonly abi: readonly [
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "sender";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "tokenId";
					readonly type: "uint256";
				},
				{
					readonly internalType: "address";
					readonly name: "owner";
					readonly type: "address";
				}
			];
			readonly name: "ERC721IncorrectOwner";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "operator";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "tokenId";
					readonly type: "uint256";
				}
			];
			readonly name: "ERC721InsufficientApproval";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "approver";
					readonly type: "address";
				}
			];
			readonly name: "ERC721InvalidApprover";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "operator";
					readonly type: "address";
				}
			];
			readonly name: "ERC721InvalidOperator";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "owner";
					readonly type: "address";
				}
			];
			readonly name: "ERC721InvalidOwner";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "receiver";
					readonly type: "address";
				}
			];
			readonly name: "ERC721InvalidReceiver";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "sender";
					readonly type: "address";
				}
			];
			readonly name: "ERC721InvalidSender";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "tokenId";
					readonly type: "uint256";
				}
			];
			readonly name: "ERC721NonexistentToken";
			readonly type: "error";
		}
	];
	static createInterface(): IERC721ErrorsInterface;
	static connect(address: string, runner?: ContractRunner | null): IERC721Errors;
}
export type ERC1967UtilsConstructorParams = [
	signer?: Signer
] | ConstructorParameters<typeof ContractFactory>;
export declare class ERC1967Utils__factory extends ContractFactory {
	constructor(...args: ERC1967UtilsConstructorParams);
	getDeployTransaction(overrides?: NonPayableOverrides & {
		from?: string;
	}): Promise<ContractDeployTransaction>;
	deploy(overrides?: NonPayableOverrides & {
		from?: string;
	}): Promise<ERC1967Utils & {
		deploymentTransaction(): ContractTransactionResponse;
	}>;
	connect(runner: ContractRunner | null): ERC1967Utils__factory;
	static readonly bytecode = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea2646970667358221220a39d0829e984d529e4c6f0588125608807011f6a77274c9e5bcc57e5f7feefc264736f6c634300081e0033";
	static readonly abi: readonly [
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "admin";
					readonly type: "address";
				}
			];
			readonly name: "ERC1967InvalidAdmin";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "beacon";
					readonly type: "address";
				}
			];
			readonly name: "ERC1967InvalidBeacon";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "implementation";
					readonly type: "address";
				}
			];
			readonly name: "ERC1967InvalidImplementation";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "ERC1967NonPayable";
			readonly type: "error";
		}
	];
	static createInterface(): ERC1967UtilsInterface;
	static connect(address: string, runner?: ContractRunner | null): ERC1967Utils;
}
export declare class Proxy__factory {
	static readonly abi: readonly [
		{
			readonly stateMutability: "payable";
			readonly type: "fallback";
		}
	];
	static createInterface(): ProxyInterface;
	static connect(address: string, runner?: ContractRunner | null): Proxy$1;
}
export declare class IBeacon__factory {
	static readonly abi: readonly [
		{
			readonly inputs: readonly [
			];
			readonly name: "implementation";
			readonly outputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "";
					readonly type: "address";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		}
	];
	static createInterface(): IBeaconInterface;
	static connect(address: string, runner?: ContractRunner | null): IBeacon;
}
export declare class ERC20__factory {
	static readonly abi: readonly [
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "spender";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "allowance";
					readonly type: "uint256";
				},
				{
					readonly internalType: "uint256";
					readonly name: "needed";
					readonly type: "uint256";
				}
			];
			readonly name: "ERC20InsufficientAllowance";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "sender";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "balance";
					readonly type: "uint256";
				},
				{
					readonly internalType: "uint256";
					readonly name: "needed";
					readonly type: "uint256";
				}
			];
			readonly name: "ERC20InsufficientBalance";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "approver";
					readonly type: "address";
				}
			];
			readonly name: "ERC20InvalidApprover";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "receiver";
					readonly type: "address";
				}
			];
			readonly name: "ERC20InvalidReceiver";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "sender";
					readonly type: "address";
				}
			];
			readonly name: "ERC20InvalidSender";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "spender";
					readonly type: "address";
				}
			];
			readonly name: "ERC20InvalidSpender";
			readonly type: "error";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "owner";
					readonly type: "address";
				},
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "spender";
					readonly type: "address";
				},
				{
					readonly indexed: false;
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "Approval";
			readonly type: "event";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "from";
					readonly type: "address";
				},
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "to";
					readonly type: "address";
				},
				{
					readonly indexed: false;
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "Transfer";
			readonly type: "event";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "owner";
					readonly type: "address";
				},
				{
					readonly internalType: "address";
					readonly name: "spender";
					readonly type: "address";
				}
			];
			readonly name: "allowance";
			readonly outputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "spender";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "approve";
			readonly outputs: readonly [
				{
					readonly internalType: "bool";
					readonly name: "";
					readonly type: "bool";
				}
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "account";
					readonly type: "address";
				}
			];
			readonly name: "balanceOf";
			readonly outputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "decimals";
			readonly outputs: readonly [
				{
					readonly internalType: "uint8";
					readonly name: "";
					readonly type: "uint8";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "name";
			readonly outputs: readonly [
				{
					readonly internalType: "string";
					readonly name: "";
					readonly type: "string";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "symbol";
			readonly outputs: readonly [
				{
					readonly internalType: "string";
					readonly name: "";
					readonly type: "string";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "totalSupply";
			readonly outputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "to";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "transfer";
			readonly outputs: readonly [
				{
					readonly internalType: "bool";
					readonly name: "";
					readonly type: "bool";
				}
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "from";
					readonly type: "address";
				},
				{
					readonly internalType: "address";
					readonly name: "to";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "transferFrom";
			readonly outputs: readonly [
				{
					readonly internalType: "bool";
					readonly name: "";
					readonly type: "bool";
				}
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		}
	];
	static createInterface(): ERC20Interface;
	static connect(address: string, runner?: ContractRunner | null): ERC20;
}
export declare class IERC20__factory {
	static readonly abi: readonly [
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "owner";
					readonly type: "address";
				},
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "spender";
					readonly type: "address";
				},
				{
					readonly indexed: false;
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "Approval";
			readonly type: "event";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "from";
					readonly type: "address";
				},
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "to";
					readonly type: "address";
				},
				{
					readonly indexed: false;
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "Transfer";
			readonly type: "event";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "owner";
					readonly type: "address";
				},
				{
					readonly internalType: "address";
					readonly name: "spender";
					readonly type: "address";
				}
			];
			readonly name: "allowance";
			readonly outputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "spender";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "approve";
			readonly outputs: readonly [
				{
					readonly internalType: "bool";
					readonly name: "";
					readonly type: "bool";
				}
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "account";
					readonly type: "address";
				}
			];
			readonly name: "balanceOf";
			readonly outputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "totalSupply";
			readonly outputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "to";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "transfer";
			readonly outputs: readonly [
				{
					readonly internalType: "bool";
					readonly name: "";
					readonly type: "bool";
				}
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "from";
					readonly type: "address";
				},
				{
					readonly internalType: "address";
					readonly name: "to";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "transferFrom";
			readonly outputs: readonly [
				{
					readonly internalType: "bool";
					readonly name: "";
					readonly type: "bool";
				}
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		}
	];
	static createInterface(): IERC20Interface;
	static connect(address: string, runner?: ContractRunner | null): IERC20;
}
export declare class ERC20Burnable__factory {
	static readonly abi: readonly [
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "spender";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "allowance";
					readonly type: "uint256";
				},
				{
					readonly internalType: "uint256";
					readonly name: "needed";
					readonly type: "uint256";
				}
			];
			readonly name: "ERC20InsufficientAllowance";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "sender";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "balance";
					readonly type: "uint256";
				},
				{
					readonly internalType: "uint256";
					readonly name: "needed";
					readonly type: "uint256";
				}
			];
			readonly name: "ERC20InsufficientBalance";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "approver";
					readonly type: "address";
				}
			];
			readonly name: "ERC20InvalidApprover";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "receiver";
					readonly type: "address";
				}
			];
			readonly name: "ERC20InvalidReceiver";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "sender";
					readonly type: "address";
				}
			];
			readonly name: "ERC20InvalidSender";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "spender";
					readonly type: "address";
				}
			];
			readonly name: "ERC20InvalidSpender";
			readonly type: "error";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "owner";
					readonly type: "address";
				},
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "spender";
					readonly type: "address";
				},
				{
					readonly indexed: false;
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "Approval";
			readonly type: "event";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "from";
					readonly type: "address";
				},
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "to";
					readonly type: "address";
				},
				{
					readonly indexed: false;
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "Transfer";
			readonly type: "event";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "owner";
					readonly type: "address";
				},
				{
					readonly internalType: "address";
					readonly name: "spender";
					readonly type: "address";
				}
			];
			readonly name: "allowance";
			readonly outputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "spender";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "approve";
			readonly outputs: readonly [
				{
					readonly internalType: "bool";
					readonly name: "";
					readonly type: "bool";
				}
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "account";
					readonly type: "address";
				}
			];
			readonly name: "balanceOf";
			readonly outputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "burn";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "account";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "burnFrom";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "decimals";
			readonly outputs: readonly [
				{
					readonly internalType: "uint8";
					readonly name: "";
					readonly type: "uint8";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "name";
			readonly outputs: readonly [
				{
					readonly internalType: "string";
					readonly name: "";
					readonly type: "string";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "symbol";
			readonly outputs: readonly [
				{
					readonly internalType: "string";
					readonly name: "";
					readonly type: "string";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "totalSupply";
			readonly outputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "to";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "transfer";
			readonly outputs: readonly [
				{
					readonly internalType: "bool";
					readonly name: "";
					readonly type: "bool";
				}
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "from";
					readonly type: "address";
				},
				{
					readonly internalType: "address";
					readonly name: "to";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "transferFrom";
			readonly outputs: readonly [
				{
					readonly internalType: "bool";
					readonly name: "";
					readonly type: "bool";
				}
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		}
	];
	static createInterface(): ERC20BurnableInterface;
	static connect(address: string, runner?: ContractRunner | null): ERC20Burnable;
}
export declare class ERC20Permit__factory {
	static readonly abi: readonly [
		{
			readonly inputs: readonly [
			];
			readonly name: "ECDSAInvalidSignature";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "length";
					readonly type: "uint256";
				}
			];
			readonly name: "ECDSAInvalidSignatureLength";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "bytes32";
					readonly name: "s";
					readonly type: "bytes32";
				}
			];
			readonly name: "ECDSAInvalidSignatureS";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "spender";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "allowance";
					readonly type: "uint256";
				},
				{
					readonly internalType: "uint256";
					readonly name: "needed";
					readonly type: "uint256";
				}
			];
			readonly name: "ERC20InsufficientAllowance";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "sender";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "balance";
					readonly type: "uint256";
				},
				{
					readonly internalType: "uint256";
					readonly name: "needed";
					readonly type: "uint256";
				}
			];
			readonly name: "ERC20InsufficientBalance";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "approver";
					readonly type: "address";
				}
			];
			readonly name: "ERC20InvalidApprover";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "receiver";
					readonly type: "address";
				}
			];
			readonly name: "ERC20InvalidReceiver";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "sender";
					readonly type: "address";
				}
			];
			readonly name: "ERC20InvalidSender";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "spender";
					readonly type: "address";
				}
			];
			readonly name: "ERC20InvalidSpender";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "deadline";
					readonly type: "uint256";
				}
			];
			readonly name: "ERC2612ExpiredSignature";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "signer";
					readonly type: "address";
				},
				{
					readonly internalType: "address";
					readonly name: "owner";
					readonly type: "address";
				}
			];
			readonly name: "ERC2612InvalidSigner";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "account";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "currentNonce";
					readonly type: "uint256";
				}
			];
			readonly name: "InvalidAccountNonce";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "InvalidShortString";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "string";
					readonly name: "str";
					readonly type: "string";
				}
			];
			readonly name: "StringTooLong";
			readonly type: "error";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "owner";
					readonly type: "address";
				},
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "spender";
					readonly type: "address";
				},
				{
					readonly indexed: false;
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "Approval";
			readonly type: "event";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
			];
			readonly name: "EIP712DomainChanged";
			readonly type: "event";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "from";
					readonly type: "address";
				},
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "to";
					readonly type: "address";
				},
				{
					readonly indexed: false;
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "Transfer";
			readonly type: "event";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "DOMAIN_SEPARATOR";
			readonly outputs: readonly [
				{
					readonly internalType: "bytes32";
					readonly name: "";
					readonly type: "bytes32";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "owner";
					readonly type: "address";
				},
				{
					readonly internalType: "address";
					readonly name: "spender";
					readonly type: "address";
				}
			];
			readonly name: "allowance";
			readonly outputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "spender";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "approve";
			readonly outputs: readonly [
				{
					readonly internalType: "bool";
					readonly name: "";
					readonly type: "bool";
				}
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "account";
					readonly type: "address";
				}
			];
			readonly name: "balanceOf";
			readonly outputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "decimals";
			readonly outputs: readonly [
				{
					readonly internalType: "uint8";
					readonly name: "";
					readonly type: "uint8";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "eip712Domain";
			readonly outputs: readonly [
				{
					readonly internalType: "bytes1";
					readonly name: "fields";
					readonly type: "bytes1";
				},
				{
					readonly internalType: "string";
					readonly name: "name";
					readonly type: "string";
				},
				{
					readonly internalType: "string";
					readonly name: "version";
					readonly type: "string";
				},
				{
					readonly internalType: "uint256";
					readonly name: "chainId";
					readonly type: "uint256";
				},
				{
					readonly internalType: "address";
					readonly name: "verifyingContract";
					readonly type: "address";
				},
				{
					readonly internalType: "bytes32";
					readonly name: "salt";
					readonly type: "bytes32";
				},
				{
					readonly internalType: "uint256[]";
					readonly name: "extensions";
					readonly type: "uint256[]";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "name";
			readonly outputs: readonly [
				{
					readonly internalType: "string";
					readonly name: "";
					readonly type: "string";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "owner";
					readonly type: "address";
				}
			];
			readonly name: "nonces";
			readonly outputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "owner";
					readonly type: "address";
				},
				{
					readonly internalType: "address";
					readonly name: "spender";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				},
				{
					readonly internalType: "uint256";
					readonly name: "deadline";
					readonly type: "uint256";
				},
				{
					readonly internalType: "uint8";
					readonly name: "v";
					readonly type: "uint8";
				},
				{
					readonly internalType: "bytes32";
					readonly name: "r";
					readonly type: "bytes32";
				},
				{
					readonly internalType: "bytes32";
					readonly name: "s";
					readonly type: "bytes32";
				}
			];
			readonly name: "permit";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "symbol";
			readonly outputs: readonly [
				{
					readonly internalType: "string";
					readonly name: "";
					readonly type: "string";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "totalSupply";
			readonly outputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "to";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "transfer";
			readonly outputs: readonly [
				{
					readonly internalType: "bool";
					readonly name: "";
					readonly type: "bool";
				}
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "from";
					readonly type: "address";
				},
				{
					readonly internalType: "address";
					readonly name: "to";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "transferFrom";
			readonly outputs: readonly [
				{
					readonly internalType: "bool";
					readonly name: "";
					readonly type: "bool";
				}
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		}
	];
	static createInterface(): ERC20PermitInterface;
	static connect(address: string, runner?: ContractRunner | null): ERC20Permit;
}
export declare class IERC20Metadata__factory {
	static readonly abi: readonly [
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "owner";
					readonly type: "address";
				},
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "spender";
					readonly type: "address";
				},
				{
					readonly indexed: false;
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "Approval";
			readonly type: "event";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "from";
					readonly type: "address";
				},
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "to";
					readonly type: "address";
				},
				{
					readonly indexed: false;
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "Transfer";
			readonly type: "event";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "owner";
					readonly type: "address";
				},
				{
					readonly internalType: "address";
					readonly name: "spender";
					readonly type: "address";
				}
			];
			readonly name: "allowance";
			readonly outputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "spender";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "approve";
			readonly outputs: readonly [
				{
					readonly internalType: "bool";
					readonly name: "";
					readonly type: "bool";
				}
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "account";
					readonly type: "address";
				}
			];
			readonly name: "balanceOf";
			readonly outputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "decimals";
			readonly outputs: readonly [
				{
					readonly internalType: "uint8";
					readonly name: "";
					readonly type: "uint8";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "name";
			readonly outputs: readonly [
				{
					readonly internalType: "string";
					readonly name: "";
					readonly type: "string";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "symbol";
			readonly outputs: readonly [
				{
					readonly internalType: "string";
					readonly name: "";
					readonly type: "string";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "totalSupply";
			readonly outputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "to";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "transfer";
			readonly outputs: readonly [
				{
					readonly internalType: "bool";
					readonly name: "";
					readonly type: "bool";
				}
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "from";
					readonly type: "address";
				},
				{
					readonly internalType: "address";
					readonly name: "to";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "transferFrom";
			readonly outputs: readonly [
				{
					readonly internalType: "bool";
					readonly name: "";
					readonly type: "bool";
				}
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		}
	];
	static createInterface(): IERC20MetadataInterface;
	static connect(address: string, runner?: ContractRunner | null): IERC20Metadata;
}
export declare class IERC20Permit__factory {
	static readonly abi: readonly [
		{
			readonly inputs: readonly [
			];
			readonly name: "DOMAIN_SEPARATOR";
			readonly outputs: readonly [
				{
					readonly internalType: "bytes32";
					readonly name: "";
					readonly type: "bytes32";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "owner";
					readonly type: "address";
				}
			];
			readonly name: "nonces";
			readonly outputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "owner";
					readonly type: "address";
				},
				{
					readonly internalType: "address";
					readonly name: "spender";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				},
				{
					readonly internalType: "uint256";
					readonly name: "deadline";
					readonly type: "uint256";
				},
				{
					readonly internalType: "uint8";
					readonly name: "v";
					readonly type: "uint8";
				},
				{
					readonly internalType: "bytes32";
					readonly name: "r";
					readonly type: "bytes32";
				},
				{
					readonly internalType: "bytes32";
					readonly name: "s";
					readonly type: "bytes32";
				}
			];
			readonly name: "permit";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		}
	];
	static createInterface(): IERC20PermitInterface;
	static connect(address: string, runner?: ContractRunner | null): IERC20Permit;
}
export type SafeERC20ConstructorParams = [
	signer?: Signer
] | ConstructorParameters<typeof ContractFactory>;
export declare class SafeERC20__factory extends ContractFactory {
	constructor(...args: SafeERC20ConstructorParams);
	getDeployTransaction(overrides?: NonPayableOverrides & {
		from?: string;
	}): Promise<ContractDeployTransaction>;
	deploy(overrides?: NonPayableOverrides & {
		from?: string;
	}): Promise<SafeERC20 & {
		deploymentTransaction(): ContractTransactionResponse;
	}>;
	connect(runner: ContractRunner | null): SafeERC20__factory;
	static readonly bytecode = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea2646970667358221220c7d077b1300ac82fffc4f93d37cf48b6139c9ebc148559233e3dee996cebdb4964736f6c634300081e0033";
	static readonly abi: readonly [
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "spender";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "currentAllowance";
					readonly type: "uint256";
				},
				{
					readonly internalType: "uint256";
					readonly name: "requestedDecrease";
					readonly type: "uint256";
				}
			];
			readonly name: "SafeERC20FailedDecreaseAllowance";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "token";
					readonly type: "address";
				}
			];
			readonly name: "SafeERC20FailedOperation";
			readonly type: "error";
		}
	];
	static createInterface(): SafeERC20Interface;
	static connect(address: string, runner?: ContractRunner | null): SafeERC20;
}
export type AddressConstructorParams = [
	signer?: Signer
] | ConstructorParameters<typeof ContractFactory>;
export declare class Address__factory extends ContractFactory {
	constructor(...args: AddressConstructorParams);
	getDeployTransaction(overrides?: NonPayableOverrides & {
		from?: string;
	}): Promise<ContractDeployTransaction>;
	deploy(overrides?: NonPayableOverrides & {
		from?: string;
	}): Promise<Address & {
		deploymentTransaction(): ContractTransactionResponse;
	}>;
	connect(runner: ContractRunner | null): Address__factory;
	static readonly bytecode = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea26469706673582212203ec2d79915d1412c09a810d518dbbf2ca40ad8e4067bb7f19814e7373d45f7c164736f6c634300081e0033";
	static readonly abi: readonly [
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "target";
					readonly type: "address";
				}
			];
			readonly name: "AddressEmptyCode";
			readonly type: "error";
		}
	];
	static createInterface(): AddressInterface;
	static connect(address: string, runner?: ContractRunner | null): Address;
}
export type ErrorsConstructorParams = [
	signer?: Signer
] | ConstructorParameters<typeof ContractFactory>;
export declare class Errors__factory extends ContractFactory {
	constructor(...args: ErrorsConstructorParams);
	getDeployTransaction(overrides?: NonPayableOverrides & {
		from?: string;
	}): Promise<ContractDeployTransaction>;
	deploy(overrides?: NonPayableOverrides & {
		from?: string;
	}): Promise<Errors & {
		deploymentTransaction(): ContractTransactionResponse;
	}>;
	connect(runner: ContractRunner | null): Errors__factory;
	static readonly bytecode = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea264697066735822122051c5fdb3a525a8d8e42079c93bad5d4962dc884cb9fe77ae51f5effd225ddca664736f6c634300081e0033";
	static readonly abi: readonly [
		{
			readonly inputs: readonly [
			];
			readonly name: "FailedCall";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "FailedDeployment";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "balance";
					readonly type: "uint256";
				},
				{
					readonly internalType: "uint256";
					readonly name: "needed";
					readonly type: "uint256";
				}
			];
			readonly name: "InsufficientBalance";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "";
					readonly type: "address";
				}
			];
			readonly name: "MissingPrecompile";
			readonly type: "error";
		}
	];
	static createInterface(): ErrorsInterface;
	static connect(address: string, runner?: ContractRunner | null): Errors;
}
export declare class Nonces__factory {
	static readonly abi: readonly [
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "account";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "currentNonce";
					readonly type: "uint256";
				}
			];
			readonly name: "InvalidAccountNonce";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "owner";
					readonly type: "address";
				}
			];
			readonly name: "nonces";
			readonly outputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		}
	];
	static createInterface(): NoncesInterface;
	static connect(address: string, runner?: ContractRunner | null): Nonces;
}
export type ShortStringsConstructorParams = [
	signer?: Signer
] | ConstructorParameters<typeof ContractFactory>;
export declare class ShortStrings__factory extends ContractFactory {
	constructor(...args: ShortStringsConstructorParams);
	getDeployTransaction(overrides?: NonPayableOverrides & {
		from?: string;
	}): Promise<ContractDeployTransaction>;
	deploy(overrides?: NonPayableOverrides & {
		from?: string;
	}): Promise<ShortStrings & {
		deploymentTransaction(): ContractTransactionResponse;
	}>;
	connect(runner: ContractRunner | null): ShortStrings__factory;
	static readonly bytecode = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea2646970667358221220177da2610add2c753be76964c1360b0ac0bb07800c185f028b5fa9832e9ef09d64736f6c634300081e0033";
	static readonly abi: readonly [
		{
			readonly inputs: readonly [
			];
			readonly name: "InvalidShortString";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "string";
					readonly name: "str";
					readonly type: "string";
				}
			];
			readonly name: "StringTooLong";
			readonly type: "error";
		}
	];
	static createInterface(): ShortStringsInterface;
	static connect(address: string, runner?: ContractRunner | null): ShortStrings;
}
export type StringsConstructorParams = [
	signer?: Signer
] | ConstructorParameters<typeof ContractFactory>;
export declare class Strings__factory extends ContractFactory {
	constructor(...args: StringsConstructorParams);
	getDeployTransaction(overrides?: NonPayableOverrides & {
		from?: string;
	}): Promise<ContractDeployTransaction>;
	deploy(overrides?: NonPayableOverrides & {
		from?: string;
	}): Promise<Strings & {
		deploymentTransaction(): ContractTransactionResponse;
	}>;
	connect(runner: ContractRunner | null): Strings__factory;
	static readonly bytecode = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea264697066735822122053fe171f6807a493d2cfd8af60eb3df9d8e1ca346124390802362214776e8e3b64736f6c634300081e0033";
	static readonly abi: readonly [
		{
			readonly inputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				},
				{
					readonly internalType: "uint256";
					readonly name: "length";
					readonly type: "uint256";
				}
			];
			readonly name: "StringsInsufficientHexLength";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "StringsInvalidAddressFormat";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "StringsInvalidChar";
			readonly type: "error";
		}
	];
	static createInterface(): StringsInterface;
	static connect(address: string, runner?: ContractRunner | null): Strings;
}
export type ECDSAConstructorParams = [
	signer?: Signer
] | ConstructorParameters<typeof ContractFactory>;
export declare class ECDSA__factory extends ContractFactory {
	constructor(...args: ECDSAConstructorParams);
	getDeployTransaction(overrides?: NonPayableOverrides & {
		from?: string;
	}): Promise<ContractDeployTransaction>;
	deploy(overrides?: NonPayableOverrides & {
		from?: string;
	}): Promise<ECDSA & {
		deploymentTransaction(): ContractTransactionResponse;
	}>;
	connect(runner: ContractRunner | null): ECDSA__factory;
	static readonly bytecode = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea2646970667358221220d8c3fc9a01fd94edaea5dbd1e3935bff501bfec69747a291661cc32086ef38bd64736f6c634300081e0033";
	static readonly abi: readonly [
		{
			readonly inputs: readonly [
			];
			readonly name: "ECDSAInvalidSignature";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "length";
					readonly type: "uint256";
				}
			];
			readonly name: "ECDSAInvalidSignatureLength";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "bytes32";
					readonly name: "s";
					readonly type: "bytes32";
				}
			];
			readonly name: "ECDSAInvalidSignatureS";
			readonly type: "error";
		}
	];
	static createInterface(): ECDSAInterface;
	static connect(address: string, runner?: ContractRunner | null): ECDSA;
}
export declare class EIP712__factory {
	static readonly abi: readonly [
		{
			readonly inputs: readonly [
			];
			readonly name: "InvalidShortString";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "string";
					readonly name: "str";
					readonly type: "string";
				}
			];
			readonly name: "StringTooLong";
			readonly type: "error";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
			];
			readonly name: "EIP712DomainChanged";
			readonly type: "event";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "eip712Domain";
			readonly outputs: readonly [
				{
					readonly internalType: "bytes1";
					readonly name: "fields";
					readonly type: "bytes1";
				},
				{
					readonly internalType: "string";
					readonly name: "name";
					readonly type: "string";
				},
				{
					readonly internalType: "string";
					readonly name: "version";
					readonly type: "string";
				},
				{
					readonly internalType: "uint256";
					readonly name: "chainId";
					readonly type: "uint256";
				},
				{
					readonly internalType: "address";
					readonly name: "verifyingContract";
					readonly type: "address";
				},
				{
					readonly internalType: "bytes32";
					readonly name: "salt";
					readonly type: "bytes32";
				},
				{
					readonly internalType: "uint256[]";
					readonly name: "extensions";
					readonly type: "uint256[]";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		}
	];
	static createInterface(): EIP712Interface;
	static connect(address: string, runner?: ContractRunner | null): EIP712;
}
export declare class IERC165__factory {
	static readonly abi: readonly [
		{
			readonly inputs: readonly [
				{
					readonly internalType: "bytes4";
					readonly name: "interfaceId";
					readonly type: "bytes4";
				}
			];
			readonly name: "supportsInterface";
			readonly outputs: readonly [
				{
					readonly internalType: "bool";
					readonly name: "";
					readonly type: "bool";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		}
	];
	static createInterface(): IERC165Interface;
	static connect(address: string, runner?: ContractRunner | null): IERC165;
}
export type SafeCastConstructorParams = [
	signer?: Signer
] | ConstructorParameters<typeof ContractFactory>;
export declare class SafeCast__factory extends ContractFactory {
	constructor(...args: SafeCastConstructorParams);
	getDeployTransaction(overrides?: NonPayableOverrides & {
		from?: string;
	}): Promise<ContractDeployTransaction>;
	deploy(overrides?: NonPayableOverrides & {
		from?: string;
	}): Promise<SafeCast & {
		deploymentTransaction(): ContractTransactionResponse;
	}>;
	connect(runner: ContractRunner | null): SafeCast__factory;
	static readonly bytecode = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea26469706673582212203246bc0384898c2786886a3a21ce6e24741ba564b94a2968ba25551c30bfe9ca64736f6c634300081e0033";
	static readonly abi: readonly [
		{
			readonly inputs: readonly [
				{
					readonly internalType: "uint8";
					readonly name: "bits";
					readonly type: "uint8";
				},
				{
					readonly internalType: "int256";
					readonly name: "value";
					readonly type: "int256";
				}
			];
			readonly name: "SafeCastOverflowedIntDowncast";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "int256";
					readonly name: "value";
					readonly type: "int256";
				}
			];
			readonly name: "SafeCastOverflowedIntToUint";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "uint8";
					readonly name: "bits";
					readonly type: "uint8";
				},
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "SafeCastOverflowedUintDowncast";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "SafeCastOverflowedUintToInt";
			readonly type: "error";
		}
	];
	static createInterface(): SafeCastInterface;
	static connect(address: string, runner?: ContractRunner | null): SafeCast;
}
export declare class OwnableUpgradeable__factory {
	static readonly abi: readonly [
		{
			readonly inputs: readonly [
			];
			readonly name: "InvalidInitialization";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "NotInitializing";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "owner";
					readonly type: "address";
				}
			];
			readonly name: "OwnableInvalidOwner";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "account";
					readonly type: "address";
				}
			];
			readonly name: "OwnableUnauthorizedAccount";
			readonly type: "error";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: false;
					readonly internalType: "uint64";
					readonly name: "version";
					readonly type: "uint64";
				}
			];
			readonly name: "Initialized";
			readonly type: "event";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "previousOwner";
					readonly type: "address";
				},
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "newOwner";
					readonly type: "address";
				}
			];
			readonly name: "OwnershipTransferred";
			readonly type: "event";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "owner";
			readonly outputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "";
					readonly type: "address";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "renounceOwnership";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "newOwner";
					readonly type: "address";
				}
			];
			readonly name: "transferOwnership";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		}
	];
	static createInterface(): OwnableUpgradeableInterface;
	static connect(address: string, runner?: ContractRunner | null): OwnableUpgradeable;
}
export declare class Initializable__factory {
	static readonly abi: readonly [
		{
			readonly inputs: readonly [
			];
			readonly name: "InvalidInitialization";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "NotInitializing";
			readonly type: "error";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: false;
					readonly internalType: "uint64";
					readonly name: "version";
					readonly type: "uint64";
				}
			];
			readonly name: "Initialized";
			readonly type: "event";
		}
	];
	static createInterface(): InitializableInterface;
	static connect(address: string, runner?: ContractRunner | null): Initializable;
}
export declare class ContextUpgradeable__factory {
	static readonly abi: readonly [
		{
			readonly inputs: readonly [
			];
			readonly name: "InvalidInitialization";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "NotInitializing";
			readonly type: "error";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: false;
					readonly internalType: "uint64";
					readonly name: "version";
					readonly type: "uint64";
				}
			];
			readonly name: "Initialized";
			readonly type: "event";
		}
	];
	static createInterface(): ContextUpgradeableInterface;
	static connect(address: string, runner?: ContractRunner | null): ContextUpgradeable;
}
export declare class ReentrancyGuardUpgradeable__factory {
	static readonly abi: readonly [
		{
			readonly inputs: readonly [
			];
			readonly name: "InvalidInitialization";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "NotInitializing";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "ReentrancyGuardReentrantCall";
			readonly type: "error";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: false;
					readonly internalType: "uint64";
					readonly name: "version";
					readonly type: "uint64";
				}
			];
			readonly name: "Initialized";
			readonly type: "event";
		}
	];
	static createInterface(): ReentrancyGuardUpgradeableInterface;
	static connect(address: string, runner?: ContractRunner | null): ReentrancyGuardUpgradeable;
}
export type GoldMinterConstructorParams = [
	signer?: Signer
] | ConstructorParameters<typeof ContractFactory>;
export declare class GoldMinter__factory extends ContractFactory {
	constructor(...args: GoldMinterConstructorParams);
	getDeployTransaction(overrides?: NonPayableOverrides & {
		from?: string;
	}): Promise<ContractDeployTransaction>;
	deploy(overrides?: NonPayableOverrides & {
		from?: string;
	}): Promise<GoldMinter & {
		deploymentTransaction(): ContractTransactionResponse;
	}>;
	connect(runner: ContractRunner | null): GoldMinter__factory;
	static readonly bytecode = "0x6080604052600a805464ffffffffff1916633201f40017905566470de4df820000600b55662386f26fc10000600c55670de0b6b3a7640000600d55600e805460ff19166001179055348015605257600080fd5b50613651806100626000396000f3fe608060405234801561001057600080fd5b50600436106102735760003560e01c806389a3027111610151578063c54e44eb116100c3578063dae2f99a11610087578063dae2f99a146105fd578063e44a316914610606578063f2fde38b14610619578063f4b891571461062c578063fc93d5171461063f578063feec756c1461065257600080fd5b8063c54e44eb1461055a578063c5d1bbc21461056d578063ca852afb146105c4578063cbb6ae3e146105d7578063d25f3d3c146105ea57600080fd5b80639eff0227116101155780639eff0227146104eb578063ad89bbb014610503578063b1da41fe1461050c578063bbde387514610521578063c422f9d014610534578063c4d66de81461054757600080fd5b806389a302711461046d5780638da5cb5b1461048057806394002b57146104b0578063986d7a69146104c35780639af1d35a146104d657600080fd5b806347082db3116101ea5780635dd871a3116101ae5780635dd871a3146103ee57806361b0402d146104015780636bffc96214610414578063715018a61461042757806374064a431461042f578063778048a01461045a57600080fd5b806347082db314610366578063491e68e21461039b578063493f4f12146103b55780634b69c0d5146103c85780634f863ea1146103db57600080fd5b80631f6a02671161023c5780631f6a0267146102ec57806333138a8414610309578063356d2c66146103125780633e032a3b1461031a578063404588d4146103405780634645b6dc1461035357600080fd5b8062b105e61461027857806308e7a41e1461028d57806314d3940d146102a057806316222b19146102b3578063186cf2b9146102c6575b600080fd5b61028b610286366004612fe2565b610665565b005b61028b61029b366004613015565b610707565b61028b6102ae366004612fe2565b61079e565b61028b6102c1366004613015565b610837565b6102d96102d43660046130fe565b610906565b6040519081526020015b60405180910390f35b600e546102f99060ff1681565b60405190151581526020016102e3565b6102d9600b5481565b61028b610946565b600a5461032d90610100900461ffff1681565b60405161ffff90911681526020016102e3565b61028b61034e366004613117565b6109ae565b6102f96103613660046131c5565b610c2d565b610389610374366004612fe2565b60076020526000908152604090205460ff1681565b60405160ff90911681526020016102e3565b600a546103a89060ff1681565b6040516102e39190613207565b61028b6103c33660046130fe565b610cae565b61028b6103d6366004613243565b610ceb565b61028b6103e936600461326d565b610d46565b6102f96103fc3660046130fe565b610ddb565b61028b61040f3660046130fe565b610ffc565b61028b61042236600461328a565b611039565b61028b611070565b600654610442906001600160a01b031681565b6040516001600160a01b0390911681526020016102e3565b61028b61046836600461328a565b611084565b600454610442906001600160a01b031681565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546001600160a01b0316610442565b600254610442906001600160a01b031681565b61028b6104d13660046132ac565b6110b3565b600a5461032d906301000000900461ffff1681565b600e546104429061010090046001600160a01b031681565b6102d9600d5481565b610514611491565b6040516102e391906132e1565b61028b61052f3660046132ac565b6114a2565b600554610442906001600160a01b031681565b61028b610555366004612fe2565b611839565b600354610442906001600160a01b031681565b61058061057b3660046130fe565b611935565b604080516001600160a01b0398891681529790961660208801529486019390935260608501919091526080840152151560a0830152151560c082015260e0016102e3565b61028b6105d23660046130fe565b611994565b6105806105e53660046130fe565b6119d1565b6102d96105f83660046131c5565b6119e1565b6102d9600c5481565b61028b61061436600461332d565b611bf8565b61028b610627366004612fe2565b611c97565b6102d961063a3660046131c5565b611cd5565b61028b61064d36600461326d565b611ed8565b61028b610660366004612fe2565b611f69565b61066d611fc7565b610678600082612022565b6106bb5760405162461bcd60e51b815260206004820152600f60248201526e24a72b20a624a22fa9a2aa2a2622a960891b60448201526064015b60405180910390fd5b6106c6600082612047565b506040516001600160a01b03821681527fc75b24622d5a8552bcfe775a11d9009ac47d4c050a3af79686aebe33f902fc03906020015b60405180910390a150565b60008060006107158461205c565b60025460405163d505accf60e01b815293965091945092506001600160a01b03169063d505accf9061075790339030908c908b908a908a908a90600401613362565b600060405180830381600087803b15801561077157600080fd5b505af1158015610785573d6000803e3d6000fd5b505050506107948888886114a2565b5050505050505050565b6107a6611fc7565b6107b1600082612022565b156107f25760405162461bcd60e51b8152602060048201526011602482015270222aa82624a1a0aa22afa9a2aa2a2622a960791b60448201526064016106b2565b6107fd6000826120a6565b506040516001600160a01b03821681527f0e8d4de8d62b8ad5b1837a4a13009121b82a40e3bdcd6e6f454a72418cc86b0e906020016106fc565b60008060006108458461205c565b60035492955090935091506000906001600160a01b038a8116911614610876576004546001600160a01b0316610883565b6003546001600160a01b03165b60405163d505accf60e01b81529091506001600160a01b0382169063d505accf906108be90339030908d908c908b908b908b90600401613362565b600060405180830381600087803b1580156108d857600080fd5b505af11580156108ec573d6000803e3d6000fd5b505050506108fb8989896110b3565b505050505050505050565b6000600d5482101561091a575050600c5490565b600a5461271090610936906301000000900461ffff16846133b9565b61094091906133d0565b92915050565b61094e611fc7565b600e5460ff1661095f576001610962565b60005b600e805460ff1916911515918217905560405160ff909116151581527ffab1a2e8d359cc6254f5d7cb67a07c879262e5265e7099012b96ed60aace3bd9906020015b60405180910390a1565b60006109b86120bb565b805490915060ff600160401b820416159067ffffffffffffffff166000811580156109e05750825b905060008267ffffffffffffffff1660011480156109fd5750303b155b905081158015610a0b575080155b15610a295760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff191660011785558315610a5357845460ff60401b1916600160401b1785555b610a5c876120e4565b610a646120fe565b8c600260006101000a8154816001600160a01b0302191690836001600160a01b031602179055508b600360006101000a8154816001600160a01b0302191690836001600160a01b031602179055508a600460006101000a8154816001600160a01b0302191690836001600160a01b0316021790555089600560006101000a8154816001600160a01b0302191690836001600160a01b0316021790555088600660006101000a8154816001600160a01b0302191690836001600160a01b031602179055506101f4600a60016101000a81548161ffff021916908361ffff1602179055506032600a60036101000a81548161ffff021916908361ffff16021790555066470de4df820000600b81905550662386f26fc10000600c81905550670de0b6b3a7640000600d8190555085600e60006101000a81548160ff02191690831515021790555087600e60016101000a8154816001600160a01b0302191690836001600160a01b03160217905550610bd861210e565b8315610c1e57845460ff60401b19168555604051600181527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b50505050505050505050505050565b600e546040516370a0823160e01b81526101009091046001600160a01b03908116600483015260009183918516906370a0823190602401602060405180830381865afa158015610c81573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ca591906133f2565b10159392505050565b610cb6611fc7565b600b8190556040518181527f3bb3914a552b684e79c3a89fd2170bebf1701d7ae5ec2eaf68d5b1879e32d647906020016106fc565b610cf3611fc7565b600a805482919060ff19166001836002811115610d1257610d126131f1565b02179055507ff054a19585a0477b2acc9e8a0305be61ee7e708a3e5e10bae7cf6816cefb61b1816040516106fc9190613207565b610d4e611fc7565b6103e88160ff1610610d8d5760405162461bcd60e51b81526020600482015260086024820152674f564552464c4f5760c01b60448201526064016106b2565b600a805464ffff000000191660ff831663010000008102919091179091556040519081527f0e0620d0d7c6ab0fd4ceb44a51188b8687603abffb0b5f4fd545c7b1651ffedc906020016106fc565b600080600260009054906101000a90046001600160a01b03166001600160a01b03166318160ddd6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610e31573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e5591906133f2565b90506000600260009054906101000a90046001600160a01b03166001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015610eac573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ed0919061340b565b90506000600660009054906101000a90046001600160a01b03166001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015610f27573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f4b919061340b565b90506000610f598284613428565b610f6490600a613528565b600660009054906101000a90046001600160a01b03166001600160a01b03166350d25bcd6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610fb7573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610fdb91906133f2565b610fe591906133b9565b9050610ff18685613537565b111595945050505050565b611004611fc7565b600d8190556040518181527f344fc794e286be40a05fe3e034a7ae3971ef147aa05abca6d19b9ecea71f9545906020016106fc565b611046335b600090612022565b6110625760405162461bcd60e51b81526004016106b29061354a565b61106c82826124c2565b5050565b611078611fc7565b6110826000612833565b565b61108d3361103e565b6110a95760405162461bcd60e51b81526004016106b29061354a565b61106c82826128a4565b6110bb612c67565b60006110c78484611cd5565b600a549091508290612710906110e690610100900461ffff168261356f565b6110f49061ffff16846133b9565b6110fe91906133d0565b11801561113b5750600a546127109061112090610100900461ffff1682613589565b61112e9061ffff16836133b9565b61113891906133d0565b82115b6111755760405162461bcd60e51b815260206004820152600b60248201526a155b99195c9c1c9a58d95960aa1b60448201526064016106b2565b600b548210156111b55760405162461bcd60e51b815260206004820152600b60248201526a14db585b1b105b5bdd5b9d60aa1b60448201526064016106b2565b600a5460ff1660028111156111cc576111cc6131f1565b3360009081526007602052604090205460ff16101561121a5760405162461bcd60e51b815260206004820152600a602482015269155b99195c9b195d995b60b21b60448201526064016106b2565b6003546000906001600160a01b03868116911614611243576004546001600160a01b0316611250565b6003546001600160a01b03165b600e54909150611275906001600160a01b038084169133916101009091041687612c9f565b600880546040805160e081018252338082526001600160a01b03868116602084019081528385018b8152606085018b815260006080870181815260a0880182815260c0890183815260018c018d559b909252965160068a027ff3f7a9fe364faab93b216da50a3214154f22a0a2b415b23a84c8169e8b636ee3810180549288166001600160a01b031993841617905594517ff3f7a9fe364faab93b216da50a3214154f22a0a2b415b23a84c8169e8b636ee4860180549190971691161790945590517ff3f7a9fe364faab93b216da50a3214154f22a0a2b415b23a84c8169e8b636ee5830155517ff3f7a9fe364faab93b216da50a3214154f22a0a2b415b23a84c8169e8b636ee682015592517ff3f7a9fe364faab93b216da50a3214154f22a0a2b415b23a84c8169e8b636ee7840155517ff3f7a9fe364faab93b216da50a3214154f22a0a2b415b23a84c8169e8b636ee89092018054955115156101000261ff00199315159390931661ffff1990961695909517919091179093555190919082907f69c44c537610b2d184f027357271fee6d9eb25ae2b4ccc21d6e56c7bec184196906114459086908a908a906001600160a01b039390931683526020830191909152604082015260600190565b60405180910390a3600e5460ff168015611463575061146383610ddb565b156114725761147281846128a4565b50505061148c60016000805160206135fc83398151915255565b505050565b606061149d6000612d20565b905090565b6114aa612c67565b60006114b684846119e1565b600a549091508290612710906114d590610100900461ffff168261356f565b6114e39061ffff16846133b9565b6114ed91906133d0565b1015801561152b5750600a546127109061151090610100900461ffff1682613589565b61151e9061ffff16836133b9565b61152891906133d0565b82115b6115655760405162461bcd60e51b815260206004820152600b60248201526a155b99195c9c1c9a58d95960aa1b60448201526064016106b2565b600b548310156115a55760405162461bcd60e51b815260206004820152600b60248201526a14db585b1b105b5bdd5b9d60aa1b60448201526064016106b2565b600a5460ff1660028111156115bc576115bc6131f1565b3360009081526007602052604090205460ff16101561160a5760405162461bcd60e51b815260206004820152600a602482015269155b99195c9b195d995b60b21b60448201526064016106b2565b600254611622906001600160a01b0316333086612c9f565b600980546040805160e081018252338082526001600160a01b03898116602084019081528385018a8152606085018a815260006080870181815260a0880182815260c0890183815260018c018d559b909252965160068a027f6e1540171b6c0c960b71a7020d9f60077f6af931a8bbf590da0223dacf75c7af810180549288166001600160a01b031993841617905594517f6e1540171b6c0c960b71a7020d9f60077f6af931a8bbf590da0223dacf75c7b0860180549190971691161790945590517f6e1540171b6c0c960b71a7020d9f60077f6af931a8bbf590da0223dacf75c7b1830155517f6e1540171b6c0c960b71a7020d9f60077f6af931a8bbf590da0223dacf75c7b282015592517f6e1540171b6c0c960b71a7020d9f60077f6af931a8bbf590da0223dacf75c7b3840155517f6e1540171b6c0c960b71a7020d9f60077f6af931a8bbf590da0223dacf75c7b49092018054955115156101000261ff00199315159390931661ffff1990961695909517919091179093555190919082907fafae12d8098a1b101657c8062a2634db5c9682923925dfbbd7bee9fb14dea6dc906117f2908990899089906001600160a01b039390931683526020830191909152604082015260600190565b60405180910390a3600e5460ff16801561181157506118118583610c2d565b156118205761182081836124c2565b505061148c60016000805160206135fc83398151915255565b60006118436120bb565b805490915060ff600160401b820416159067ffffffffffffffff1660008115801561186b5750825b905060008267ffffffffffffffff1660011480156118885750303b155b905081158015611896575080155b156118b45760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff1916600117855583156118de57845460ff60401b1916600160401b1785555b6118e7866120e4565b831561192d57845460ff60401b19168555604051600181527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b505050505050565b6009818154811061194557600080fd5b60009182526020909120600690910201805460018201546002830154600384015460048501546005909501546001600160a01b0394851696509390921693909260ff8082169161010090041687565b61199c611fc7565b600c8190556040518181527f8dada1cf336a746a27adb21b4bc2a9925382b578ec668e1ed05d79fb3198de8f906020016106fc565b6008818154811061194557600080fd5b6000806000600560009054906101000a90046001600160a01b03166001600160a01b03166350d25bcd6040518163ffffffff1660e01b8152600401602060405180830381865afa158015611a39573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611a5d91906133f2565b600560009054906101000a90046001600160a01b03166001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015611ab0573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611ad4919061340b565b915091506000600260009054906101000a90046001600160a01b03166001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015611b2d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611b51919061340b565b90506000866001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015611b93573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611bb7919061340b565b905080611bc483856135a3565b611bce9190613428565b611bd990600a613528565b611be385886133b9565b611bed91906133d0565b979650505050505050565b611c013361103e565b611c1d5760405162461bcd60e51b81526004016106b29061354a565b806002811115611c2f57611c2f6131f1565b6001600160a01b03831660008181526007602052604090819020805460ff191660ff949094169390931790925590517facee830aed55effdcd51d2550a784305c145560f19aaa8f7e02c076e4e15e28490611c8b908490613207565b60405180910390a25050565b611c9f611fc7565b6001600160a01b038116611cc957604051631e4fbdf760e01b8152600060048201526024016106b2565b611cd281612833565b50565b6000806000600560009054906101000a90046001600160a01b03166001600160a01b03166350d25bcd6040518163ffffffff1660e01b8152600401602060405180830381865afa158015611d2d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611d5191906133f2565b600560009054906101000a90046001600160a01b03166001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015611da4573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611dc8919061340b565b915091506000600260009054906101000a90046001600160a01b03166001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015611e21573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611e45919061340b565b90506000866001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015611e87573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611eab919061340b565b90508381611eb984866135a3565b611ec39190613428565b611ece90600a613528565b611be390886133b9565b611ee0611fc7565b6103e88160ff1610611f1f5760405162461bcd60e51b81526020600482015260086024820152674f564552464c4f5760c01b60448201526064016106b2565b600a805462ffff00191660ff83166101008102919091179091556040519081527f561cb38ccdb3d77bd8befae4d2acb1055ec8e5aed8a49ba9725754310b52650f906020016106fc565b611f71611fc7565b600e8054610100600160a81b0319166101006001600160a01b038416908102919091179091556040519081527fc2014e920b7997caf84bdbe9af16ae22a197f2569d6da5087765e6593ae105de906020016106fc565b33611ff97f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546001600160a01b031690565b6001600160a01b0316146110825760405163118cdaa760e01b81523360048201526024016106b2565b6001600160a01b038116600090815260018301602052604081205415155b9392505050565b6000612040836001600160a01b038416612d2d565b600080600083516041036120865750505060208101516040820151606083015160001a919061209f565b604051634be6321b60e01b815260040160405180910390fd5b9193909250565b6000612040836001600160a01b038416612e20565b6000807ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00610940565b6001600160a01b0381166120f55750335b6107f281612e6f565b612106612e80565b611082612ea5565b600a5460405161010090910461ffff1681527f561cb38ccdb3d77bd8befae4d2acb1055ec8e5aed8a49ba9725754310b52650f9060200160405180910390a1600a54604051630100000090910461ffff1681527f0e0620d0d7c6ab0fd4ceb44a51188b8687603abffb0b5f4fd545c7b1651ffedc9060200160405180910390a17f3bb3914a552b684e79c3a89fd2170bebf1701d7ae5ec2eaf68d5b1879e32d647600b546040516121c191815260200190565b60405180910390a17f8dada1cf336a746a27adb21b4bc2a9925382b578ec668e1ed05d79fb3198de8f600c546040516121fc91815260200190565b60405180910390a17f344fc794e286be40a05fe3e034a7ae3971ef147aa05abca6d19b9ecea71f9545600d5460405161223791815260200190565b60405180910390a1600e5460405160ff909116151581527ffab1a2e8d359cc6254f5d7cb67a07c879262e5265e7099012b96ed60aace3bd99060200160405180910390a1600a546040517ff054a19585a0477b2acc9e8a0305be61ee7e708a3e5e10bae7cf6816cefb61b1916122b29160ff90911690613207565b60405180910390a1600e546040516101009091046001600160a01b031681527fc2014e920b7997caf84bdbe9af16ae22a197f2569d6da5087765e6593ae105de9060200160405180910390a16002546040805163313ce56760e01b815290517f60ca852ff1baba03007bc4713a71dae297c308708cf17c690276b3daed7ab76e926001600160a01b031691829163313ce567916004808201926020929091908290030181865afa15801561236a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061238e919061340b565b6003546040805163313ce56760e01b815290516001600160a01b0390921691829163313ce5679160048083019260209291908290030181865afa1580156123d9573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906123fd919061340b565b600480546040805163313ce56760e01b815290516001600160a01b0390921692839263313ce5679280830192602092918290030181865afa158015612446573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061246a919061340b565b600554600654604080516001600160a01b03998a16815260ff9889166020820152968916908701529386166060860152918616608085015290931660a083015291831660c0820152911660e0820152610100016109a4565b60095482106125035760405162461bcd60e51b815260206004820152600d60248201526c496e76616c6964206e6f6e636560981b60448201526064016106b2565b60098281548110612516576125166135bc565b906000526020600020906006020160050160019054906101000a900460ff16156125745760405162461bcd60e51b815260206004820152600f60248201526e105b1c9958591e481cd95d1d1b1959608a1b60448201526064016106b2565b600060098381548110612589576125896135bc565b60009182526020822060016006909202010154600980546001600160a01b03909216935090859081106125be576125be6135bc565b90600052602060002090600602016002015490506000600985815481106125e7576125e76135bc565b906000526020600020906006020160030154841015801561260d575061260d8385610c2d565b905080612656576126516009868154811061262a5761262a6135bc565b60009182526020909120600690910201546002546001600160a01b03908116911684612ead565b61276e565b836009868154811061266a5761266a6135bc565b906000526020600020906006020160040181905550600061268a83610906565b6002549091506001600160a01b03166342966c686126a883866135d2565b6040518263ffffffff1660e01b81526004016126c691815260200190565b600060405180830381600087803b1580156126e057600080fd5b505af11580156126f4573d6000803e3d6000fd5b5050600e5460025461271b93506001600160a01b0390811692506101009091041683612ead565b61276c600e60019054906101000a90046001600160a01b031660098881548110612747576127476135bc565b60009182526020909120600690910201546001600160a01b0387811692911688612c9f565b505b8060098681548110612782576127826135bc565b906000526020600020906006020160050160006101000a81548160ff0219169083151502179055506001600986815481106127bf576127bf6135bc565b906000526020600020906006020160050160016101000a81548160ff021916908315150217905550847f565ba89d889ea15e45400288c17db6816d132602d710eb66d0f3d9557c29481685836040516128249291909182521515602082015260400190565b60405180910390a25050505050565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c19930080546001600160a01b031981166001600160a01b03848116918217845560405192169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a3505050565b60085482106128e55760405162461bcd60e51b815260206004820152600d60248201526c496e76616c6964206e6f6e636560981b60448201526064016106b2565b600882815481106128f8576128f86135bc565b906000526020600020906006020160050160019054906101000a900460ff16156129565760405162461bcd60e51b815260206004820152600f60248201526e105b1c9958591e481cd95d1d1b1959608a1b60448201526064016106b2565b60006008838154811061296b5761296b6135bc565b9060005260206000209060060201600301548210158015612990575061299082610ddb565b905080612a5357600080600885815481106129ad576129ad6135bc565b906000526020600020906006020160010160009054906101000a90046001600160a01b0316600886815481106129e5576129e56135bc565b90600052602060002090600602016002015491509150612a4c600e60019054906101000a90046001600160a01b031660088781548110612a2757612a276135bc565b60009182526020909120600690910201546001600160a01b0385811692911684612c9f565b5050612ba4565b8160088481548110612a6757612a676135bc565b9060005260206000209060060201600401819055506000612a8783610906565b600254600e546040516340c10f1960e01b81526001600160a01b03610100909204821660048201526024810184905292935016906340c10f1990604401600060405180830381600087803b158015612ade57600080fd5b505af1158015612af2573d6000803e3d6000fd5b5050600254600880546001600160a01b0390921693506340c10f1992509087908110612b2057612b206135bc565b60009182526020909120600690910201546001600160a01b0316612b4484876135d2565b6040516001600160e01b031960e085901b1681526001600160a01b0390921660048301526024820152604401600060405180830381600087803b158015612b8a57600080fd5b505af1158015612b9e573d6000803e3d6000fd5b50505050505b8060088481548110612bb857612bb86135bc565b906000526020600020906006020160050160006101000a81548160ff021916908315150217905550600160088481548110612bf557612bf56135bc565b906000526020600020906006020160050160016101000a81548160ff021916908315150217905550827f7bc692b63ac50deef5b78a403ab84227a3ba4c9400ece341f913ea1b0bcff2a38383604051612c5a9291909182521515602082015260400190565b60405180910390a2505050565b6000805160206135fc833981519152805460011901612c9957604051633ee5aeb560e01b815260040160405180910390fd5b60029055565b6040516001600160a01b038481166024830152838116604483015260648201839052612d069186918216906323b872dd906084015b604051602081830303815290604052915060e01b6020820180516001600160e01b038381831617835250505050612ede565b50505050565b60016000805160206135fc83398151915255565b6060600061204083612f4f565b60008181526001830160205260408120548015612e16576000612d516001836135d2565b8554909150600090612d65906001906135d2565b9050808214612dca576000866000018281548110612d8557612d856135bc565b9060005260206000200154905080876000018481548110612da857612da86135bc565b6000918252602080832090910192909255918252600188019052604090208390555b8554869080612ddb57612ddb6135e5565b600190038181906000526020600020016000905590558560010160008681526020019081526020016000206000905560019350505050610940565b6000915050610940565b6000818152600183016020526040812054612e6757508154600181810184556000848152602080822090930184905584548482528286019093526040902091909155610940565b506000610940565b612e77612e80565b611cd281612fab565b612e88612fb3565b61108257604051631afcd79f60e31b815260040160405180910390fd5b612d0c612e80565b6040516001600160a01b0383811660248301526044820183905261148c91859182169063a9059cbb90606401612cd4565b600080602060008451602086016000885af180612f01576040513d6000823e3d81fd5b50506000513d91508115612f19578060011415612f26565b6001600160a01b0384163b155b15612d0657604051635274afe760e01b81526001600160a01b03851660048201526024016106b2565b606081600001805480602002602001604051908101604052809291908181526020018280548015612f9f57602002820191906000526020600020905b815481526020019060010190808311612f8b575b50505050509050919050565b611c9f612e80565b6000612fbd6120bb565b54600160401b900460ff16919050565b6001600160a01b0381168114611cd257600080fd5b600060208284031215612ff457600080fd5b813561204081612fcd565b634e487b7160e01b600052604160045260246000fd5b600080600080600060a0868803121561302d57600080fd5b853561303881612fcd565b9450602086013593506040860135925060608601359150608086013567ffffffffffffffff81111561306957600080fd5b8601601f8101881361307a57600080fd5b803567ffffffffffffffff81111561309457613094612fff565b604051601f8201601f19908116603f0116810167ffffffffffffffff811182821017156130c3576130c3612fff565b6040528181528282016020018a10156130db57600080fd5b816020840160208301376000602083830101528093505050509295509295909350565b60006020828403121561311057600080fd5b5035919050565b600080600080600080600080610100898b03121561313457600080fd5b883561313f81612fcd565b9750602089013561314f81612fcd565b9650604089013561315f81612fcd565b9550606089013561316f81612fcd565b9450608089013561317f81612fcd565b935060a089013561318f81612fcd565b925060c089013561319f81612fcd565b915060e089013580151581146131b457600080fd5b809150509295985092959890939650565b600080604083850312156131d857600080fd5b82356131e381612fcd565b946020939093013593505050565b634e487b7160e01b600052602160045260246000fd5b602081016003831061322957634e487b7160e01b600052602160045260246000fd5b91905290565b80356003811061323e57600080fd5b919050565b60006020828403121561325557600080fd5b6120408261322f565b60ff81168114611cd257600080fd5b60006020828403121561327f57600080fd5b81356120408161325e565b6000806040838503121561329d57600080fd5b50508035926020909101359150565b6000806000606084860312156132c157600080fd5b83356132cc81612fcd565b95602085013595506040909401359392505050565b602080825282518282018190526000918401906040840190835b818110156133225783516001600160a01b03168352602093840193909201916001016132fb565b509095945050505050565b6000806040838503121561334057600080fd5b823561334b81612fcd565b91506133596020840161322f565b90509250929050565b6001600160a01b0397881681529590961660208601526040850193909352606084019190915260ff16608083015260a082015260c081019190915260e00190565b634e487b7160e01b600052601160045260246000fd5b8082028115828204841417610940576109406133a3565b6000826133ed57634e487b7160e01b600052601260045260246000fd5b500490565b60006020828403121561340457600080fd5b5051919050565b60006020828403121561341d57600080fd5b81516120408161325e565b60ff8281168282160390811115610940576109406133a3565b6001815b600184111561347c57808504811115613460576134606133a3565b600184161561346e57908102905b60019390931c928002613445565b935093915050565b60008261349357506001610940565b816134a057506000610940565b81600181146134b657600281146134c0576134dc565b6001915050610940565b60ff8411156134d1576134d16133a3565b50506001821b610940565b5060208310610133831016604e8410600b84101617156134ff575081810a610940565b61350c6000198484613441565b8060001904821115613520576135206133a3565b029392505050565b600061204060ff841683613484565b80820180821115610940576109406133a3565b6020808252600b908201526a2727aa2fa9a2aa2a2622a960a91b604082015260600190565b61ffff8181168382160190811115610940576109406133a3565b61ffff8281168282160390811115610940576109406133a3565b60ff8181168382160190811115610940576109406133a3565b634e487b7160e01b600052603260045260246000fd5b81810381811115610940576109406133a3565b634e487b7160e01b600052603160045260246000fdfe9b779b17422d0df92223018b32b4d1fa46e071723d6817e2486d003becc55f00a264697066735822122077ed2aaa359986a5a99fc05c30240948acc4262732108291073cbfdd1a0a986264736f6c634300081e0033";
	static readonly abi: readonly [
		{
			readonly inputs: readonly [
			];
			readonly name: "InvalidInitialization";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "InvalidSignatureLength";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "NotInitializing";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "owner";
					readonly type: "address";
				}
			];
			readonly name: "OwnableInvalidOwner";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "account";
					readonly type: "address";
				}
			];
			readonly name: "OwnableUnauthorizedAccount";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "ReentrancyGuardReentrantCall";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "token";
					readonly type: "address";
				}
			];
			readonly name: "SafeERC20FailedOperation";
			readonly type: "error";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: false;
					readonly internalType: "address";
					readonly name: "newSettler";
					readonly type: "address";
				}
			];
			readonly name: "AddSettler";
			readonly type: "event";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: false;
					readonly internalType: "uint64";
					readonly name: "version";
					readonly type: "uint64";
				}
			];
			readonly name: "Initialized";
			readonly type: "event";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: false;
					readonly internalType: "address";
					readonly name: "goldToken";
					readonly type: "address";
				},
				{
					readonly indexed: false;
					readonly internalType: "uint8";
					readonly name: "goldTokenDecimals";
					readonly type: "uint8";
				},
				{
					readonly indexed: false;
					readonly internalType: "address";
					readonly name: "USDT";
					readonly type: "address";
				},
				{
					readonly indexed: false;
					readonly internalType: "uint8";
					readonly name: "USDTDecimals";
					readonly type: "uint8";
				},
				{
					readonly indexed: false;
					readonly internalType: "address";
					readonly name: "USDC";
					readonly type: "address";
				},
				{
					readonly indexed: false;
					readonly internalType: "uint8";
					readonly name: "USDCDecimals";
					readonly type: "uint8";
				},
				{
					readonly indexed: false;
					readonly internalType: "address";
					readonly name: "goldPriceFeed";
					readonly type: "address";
				},
				{
					readonly indexed: false;
					readonly internalType: "address";
					readonly name: "goldReserveFeed";
					readonly type: "address";
				}
			];
			readonly name: "Initialized";
			readonly type: "event";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "previousOwner";
					readonly type: "address";
				},
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "newOwner";
					readonly type: "address";
				}
			];
			readonly name: "OwnershipTransferred";
			readonly type: "event";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: false;
					readonly internalType: "address";
					readonly name: "oldSettler";
					readonly type: "address";
				}
			];
			readonly name: "RemoveSettler";
			readonly type: "event";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: true;
					readonly internalType: "uint256";
					readonly name: "nonce";
					readonly type: "uint256";
				},
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "seller";
					readonly type: "address";
				},
				{
					readonly indexed: false;
					readonly internalType: "address";
					readonly name: "usdToken";
					readonly type: "address";
				},
				{
					readonly indexed: false;
					readonly internalType: "uint256";
					readonly name: "goldAmount";
					readonly type: "uint256";
				},
				{
					readonly indexed: false;
					readonly internalType: "uint256";
					readonly name: "minUsdAmount";
					readonly type: "uint256";
				}
			];
			readonly name: "RequestBurn";
			readonly type: "event";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: true;
					readonly internalType: "uint256";
					readonly name: "nonce";
					readonly type: "uint256";
				},
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "buyer";
					readonly type: "address";
				},
				{
					readonly indexed: false;
					readonly internalType: "address";
					readonly name: "usdToken";
					readonly type: "address";
				},
				{
					readonly indexed: false;
					readonly internalType: "uint256";
					readonly name: "usdAmount";
					readonly type: "uint256";
				},
				{
					readonly indexed: false;
					readonly internalType: "uint256";
					readonly name: "minGoldAmount";
					readonly type: "uint256";
				}
			];
			readonly name: "RequestMint";
			readonly type: "event";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: true;
					readonly internalType: "uint256";
					readonly name: "nonce";
					readonly type: "uint256";
				},
				{
					readonly indexed: false;
					readonly internalType: "uint256";
					readonly name: "usdAmount";
					readonly type: "uint256";
				},
				{
					readonly indexed: false;
					readonly internalType: "bool";
					readonly name: "success";
					readonly type: "bool";
				}
			];
			readonly name: "SettleBurn";
			readonly type: "event";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: true;
					readonly internalType: "uint256";
					readonly name: "nonce";
					readonly type: "uint256";
				},
				{
					readonly indexed: false;
					readonly internalType: "uint256";
					readonly name: "goldAmount";
					readonly type: "uint256";
				},
				{
					readonly indexed: false;
					readonly internalType: "bool";
					readonly name: "success";
					readonly type: "bool";
				}
			];
			readonly name: "SettleMint";
			readonly type: "event";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: false;
					readonly internalType: "bool";
					readonly name: "settle";
					readonly type: "bool";
				}
			];
			readonly name: "UpdateAutoSettle";
			readonly type: "event";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: false;
					readonly internalType: "uint16";
					readonly name: "newFees";
					readonly type: "uint16";
				}
			];
			readonly name: "UpdateFees";
			readonly type: "event";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "user";
					readonly type: "address";
				},
				{
					readonly indexed: false;
					readonly internalType: "enum GoldMinter.Levels";
					readonly name: "level";
					readonly type: "uint8";
				}
			];
			readonly name: "UpdateLevel";
			readonly type: "event";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: false;
					readonly internalType: "uint256";
					readonly name: "minGoldAmount";
					readonly type: "uint256";
				}
			];
			readonly name: "UpdateMinGold";
			readonly type: "event";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: false;
					readonly internalType: "uint256";
					readonly name: "minGoldFee";
					readonly type: "uint256";
				}
			];
			readonly name: "UpdateMinGoldFee";
			readonly type: "event";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: false;
					readonly internalType: "uint256";
					readonly name: "minGoldFeeAmount";
					readonly type: "uint256";
				}
			];
			readonly name: "UpdateMinGoldFeeAmount";
			readonly type: "event";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: false;
					readonly internalType: "address";
					readonly name: "newRecipient";
					readonly type: "address";
				}
			];
			readonly name: "UpdateRecipient";
			readonly type: "event";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: false;
					readonly internalType: "uint16";
					readonly name: "newSlippage";
					readonly type: "uint16";
				}
			];
			readonly name: "UpdateSlippage";
			readonly type: "event";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: false;
					readonly internalType: "enum GoldMinter.Levels";
					readonly name: "level";
					readonly type: "uint8";
				}
			];
			readonly name: "UpdateTradingLevel";
			readonly type: "event";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "USDC";
			readonly outputs: readonly [
				{
					readonly internalType: "contract IERC20Exp";
					readonly name: "";
					readonly type: "address";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "USDT";
			readonly outputs: readonly [
				{
					readonly internalType: "contract IERC20Exp";
					readonly name: "";
					readonly type: "address";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "_settler";
					readonly type: "address";
				}
			];
			readonly name: "addSettler";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "autoSettle";
			readonly outputs: readonly [
				{
					readonly internalType: "bool";
					readonly name: "";
					readonly type: "bool";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly name: "burnOrders";
			readonly outputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "seller";
					readonly type: "address";
				},
				{
					readonly internalType: "contract IERC20Exp";
					readonly name: "usdToken";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "goldAmount";
					readonly type: "uint256";
				},
				{
					readonly internalType: "uint256";
					readonly name: "minUsdAmount";
					readonly type: "uint256";
				},
				{
					readonly internalType: "uint256";
					readonly name: "usdAmount";
					readonly type: "uint256";
				},
				{
					readonly internalType: "bool";
					readonly name: "success";
					readonly type: "bool";
				},
				{
					readonly internalType: "bool";
					readonly name: "isSettled";
					readonly type: "bool";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "_goldAmount";
					readonly type: "uint256";
				}
			];
			readonly name: "calculateGoldFee";
			readonly outputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "contract IERC20Exp";
					readonly name: "usdToken";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "usdAmount";
					readonly type: "uint256";
				}
			];
			readonly name: "canBurn";
			readonly outputs: readonly [
				{
					readonly internalType: "bool";
					readonly name: "";
					readonly type: "bool";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "goldAmount";
					readonly type: "uint256";
				}
			];
			readonly name: "canMint";
			readonly outputs: readonly [
				{
					readonly internalType: "bool";
					readonly name: "";
					readonly type: "bool";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "fees";
			readonly outputs: readonly [
				{
					readonly internalType: "uint16";
					readonly name: "";
					readonly type: "uint16";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "usdToken";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "usdAmount";
					readonly type: "uint256";
				}
			];
			readonly name: "getGoldAmount";
			readonly outputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "usdToken";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "goldAmount";
					readonly type: "uint256";
				}
			];
			readonly name: "getUsdAmount";
			readonly outputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "goldPriceFeed";
			readonly outputs: readonly [
				{
					readonly internalType: "contract IPriceFeed";
					readonly name: "";
					readonly type: "address";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "goldReserveFeed";
			readonly outputs: readonly [
				{
					readonly internalType: "contract IPriceFeed";
					readonly name: "";
					readonly type: "address";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "goldToken";
			readonly outputs: readonly [
				{
					readonly internalType: "contract IERC20Mintable";
					readonly name: "";
					readonly type: "address";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "_initOwner";
					readonly type: "address";
				}
			];
			readonly name: "initialize";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "_goldToken";
					readonly type: "address";
				},
				{
					readonly internalType: "address";
					readonly name: "_USDT";
					readonly type: "address";
				},
				{
					readonly internalType: "address";
					readonly name: "_USDC";
					readonly type: "address";
				},
				{
					readonly internalType: "address";
					readonly name: "_goldPriceFeed";
					readonly type: "address";
				},
				{
					readonly internalType: "address";
					readonly name: "_goldReserveFeed";
					readonly type: "address";
				},
				{
					readonly internalType: "address";
					readonly name: "_usdRecipient";
					readonly type: "address";
				},
				{
					readonly internalType: "address";
					readonly name: "_owner";
					readonly type: "address";
				},
				{
					readonly internalType: "bool";
					readonly name: "_autoSettle";
					readonly type: "bool";
				}
			];
			readonly name: "initializeGoldMinter";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "";
					readonly type: "address";
				}
			];
			readonly name: "levels";
			readonly outputs: readonly [
				{
					readonly internalType: "uint8";
					readonly name: "";
					readonly type: "uint8";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "minGoldAmount";
			readonly outputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "minGoldFee";
			readonly outputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "minGoldFeeAmount";
			readonly outputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly name: "mintOrders";
			readonly outputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "buyer";
					readonly type: "address";
				},
				{
					readonly internalType: "contract IERC20Exp";
					readonly name: "usdToken";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "usdAmount";
					readonly type: "uint256";
				},
				{
					readonly internalType: "uint256";
					readonly name: "minGoldAmount";
					readonly type: "uint256";
				},
				{
					readonly internalType: "uint256";
					readonly name: "goldAmount";
					readonly type: "uint256";
				},
				{
					readonly internalType: "bool";
					readonly name: "success";
					readonly type: "bool";
				},
				{
					readonly internalType: "bool";
					readonly name: "isSettled";
					readonly type: "bool";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "owner";
			readonly outputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "";
					readonly type: "address";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "_settler";
					readonly type: "address";
				}
			];
			readonly name: "removeSettler";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "renounceOwnership";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "_usdToken";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "_goldAmount";
					readonly type: "uint256";
				},
				{
					readonly internalType: "uint256";
					readonly name: "_minUsdAmount";
					readonly type: "uint256";
				}
			];
			readonly name: "requestBurn";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "_usdToken";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "_goldAmount";
					readonly type: "uint256";
				},
				{
					readonly internalType: "uint256";
					readonly name: "_minUsdAmount";
					readonly type: "uint256";
				},
				{
					readonly internalType: "uint256";
					readonly name: "_sigDeadline";
					readonly type: "uint256";
				},
				{
					readonly internalType: "bytes";
					readonly name: "_signature";
					readonly type: "bytes";
				}
			];
			readonly name: "requestBurnPermit";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "_usdToken";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "_usdAmount";
					readonly type: "uint256";
				},
				{
					readonly internalType: "uint256";
					readonly name: "_minGoldAmount";
					readonly type: "uint256";
				}
			];
			readonly name: "requestMint";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "_usdToken";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "_usdAmount";
					readonly type: "uint256";
				},
				{
					readonly internalType: "uint256";
					readonly name: "_minGoldAmount";
					readonly type: "uint256";
				},
				{
					readonly internalType: "uint256";
					readonly name: "_sigDeadline";
					readonly type: "uint256";
				},
				{
					readonly internalType: "bytes";
					readonly name: "_signature";
					readonly type: "bytes";
				}
			];
			readonly name: "requestMintPermit";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "user";
					readonly type: "address";
				},
				{
					readonly internalType: "enum GoldMinter.Levels";
					readonly name: "level";
					readonly type: "uint8";
				}
			];
			readonly name: "setLevel";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "burnNonce";
					readonly type: "uint256";
				},
				{
					readonly internalType: "uint256";
					readonly name: "usdAmount";
					readonly type: "uint256";
				}
			];
			readonly name: "settleBurn";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "mintNonce";
					readonly type: "uint256";
				},
				{
					readonly internalType: "uint256";
					readonly name: "goldAmount";
					readonly type: "uint256";
				}
			];
			readonly name: "settleMint";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "settlers";
			readonly outputs: readonly [
				{
					readonly internalType: "address[]";
					readonly name: "";
					readonly type: "address[]";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "slippage";
			readonly outputs: readonly [
				{
					readonly internalType: "uint16";
					readonly name: "";
					readonly type: "uint16";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "tradeLevel";
			readonly outputs: readonly [
				{
					readonly internalType: "enum GoldMinter.Levels";
					readonly name: "";
					readonly type: "uint8";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "newOwner";
					readonly type: "address";
				}
			];
			readonly name: "transferOwnership";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "updateAutoSettle";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "uint8";
					readonly name: "_fees";
					readonly type: "uint8";
				}
			];
			readonly name: "updateFees";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "_minGold";
					readonly type: "uint256";
				}
			];
			readonly name: "updateMinGold";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "_minGoldFee";
					readonly type: "uint256";
				}
			];
			readonly name: "updateMinGoldFee";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "_minGoldFeeAmount";
					readonly type: "uint256";
				}
			];
			readonly name: "updateMinGoldFeeAmount";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "_usdRecipient";
					readonly type: "address";
				}
			];
			readonly name: "updateRecipient";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "uint8";
					readonly name: "_slippage";
					readonly type: "uint8";
				}
			];
			readonly name: "updateSlippage";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "enum GoldMinter.Levels";
					readonly name: "level";
					readonly type: "uint8";
				}
			];
			readonly name: "updateTradingLevel";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "usdRecipient";
			readonly outputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "";
					readonly type: "address";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		}
	];
	static createInterface(): GoldMinterInterface;
	static connect(address: string, runner?: ContractRunner | null): GoldMinter;
}
export type LockConstructorParams = [
	signer?: Signer
] | ConstructorParameters<typeof ContractFactory>;
export declare class Lock__factory extends ContractFactory {
	constructor(...args: LockConstructorParams);
	getDeployTransaction(_unlockTime: BigNumberish, overrides?: PayableOverrides & {
		from?: string;
	}): Promise<ContractDeployTransaction>;
	deploy(_unlockTime: BigNumberish, overrides?: PayableOverrides & {
		from?: string;
	}): Promise<Lock$1 & {
		deploymentTransaction(): ContractTransactionResponse;
	}>;
	connect(runner: ContractRunner | null): Lock__factory;
	static readonly bytecode = "0x60806040526040516102a03803806102a08339810160408190526020916097565b804210607e5760405162461bcd60e51b815260206004820152602360248201527f556e6c6f636b2074696d652073686f756c6420626520696e207468652066757460448201526275726560e81b606482015260840160405180910390fd5b600055600180546001600160a01b0319163317905560af565b60006020828403121560a857600080fd5b5051919050565b6101e2806100be6000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c8063251c1aa3146100465780633ccfd60b146100625780638da5cb5b1461006c575b600080fd5b61004f60005481565b6040519081526020015b60405180910390f35b61006a610097565b005b60015461007f906001600160a01b031681565b6040516001600160a01b039091168152602001610059565b6000544210156100e75760405162461bcd60e51b8152602060048201526016602482015275165bdd4818d85b89dd081dda5d1a191c985dc81e595d60521b60448201526064015b60405180910390fd5b6001546001600160a01b031633146101385760405162461bcd60e51b81526020600482015260146024820152732cb7ba9030b932b713ba103a34329037bbb732b960611b60448201526064016100de565b604080514781524260208201527fbf2ed60bd5b5965d685680c01195c9514e4382e28e3a5a2d2d5244bf59411b93910160405180910390a16001546040516001600160a01b03909116904780156108fc02916000818181858888f193505050501580156101a9573d6000803e3d6000fd5b5056fea2646970667358221220577e90b2edcd9bc3ea9a134b778bc0d3011c381d174a223f19a5f4900c96f0cf64736f6c634300081e0033";
	static readonly abi: readonly [
		{
			readonly inputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "_unlockTime";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "payable";
			readonly type: "constructor";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: false;
					readonly internalType: "uint256";
					readonly name: "amount";
					readonly type: "uint256";
				},
				{
					readonly indexed: false;
					readonly internalType: "uint256";
					readonly name: "when";
					readonly type: "uint256";
				}
			];
			readonly name: "Withdrawal";
			readonly type: "event";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "owner";
			readonly outputs: readonly [
				{
					readonly internalType: "address payable";
					readonly name: "";
					readonly type: "address";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "unlockTime";
			readonly outputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "withdraw";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		}
	];
	static createInterface(): LockInterface;
	static connect(address: string, runner?: ContractRunner | null): Lock$1;
}
export declare class IERC20Exp__factory {
	static readonly abi: readonly [
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "owner";
					readonly type: "address";
				},
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "spender";
					readonly type: "address";
				},
				{
					readonly indexed: false;
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "Approval";
			readonly type: "event";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "from";
					readonly type: "address";
				},
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "to";
					readonly type: "address";
				},
				{
					readonly indexed: false;
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "Transfer";
			readonly type: "event";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "DOMAIN_SEPARATOR";
			readonly outputs: readonly [
				{
					readonly internalType: "bytes32";
					readonly name: "";
					readonly type: "bytes32";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "owner";
					readonly type: "address";
				},
				{
					readonly internalType: "address";
					readonly name: "spender";
					readonly type: "address";
				}
			];
			readonly name: "allowance";
			readonly outputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "spender";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "approve";
			readonly outputs: readonly [
				{
					readonly internalType: "bool";
					readonly name: "";
					readonly type: "bool";
				}
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "account";
					readonly type: "address";
				}
			];
			readonly name: "balanceOf";
			readonly outputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "decimals";
			readonly outputs: readonly [
				{
					readonly internalType: "uint8";
					readonly name: "";
					readonly type: "uint8";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "name";
			readonly outputs: readonly [
				{
					readonly internalType: "string";
					readonly name: "";
					readonly type: "string";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "owner";
					readonly type: "address";
				}
			];
			readonly name: "nonces";
			readonly outputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "owner";
					readonly type: "address";
				},
				{
					readonly internalType: "address";
					readonly name: "spender";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				},
				{
					readonly internalType: "uint256";
					readonly name: "deadline";
					readonly type: "uint256";
				},
				{
					readonly internalType: "uint8";
					readonly name: "v";
					readonly type: "uint8";
				},
				{
					readonly internalType: "bytes32";
					readonly name: "r";
					readonly type: "bytes32";
				},
				{
					readonly internalType: "bytes32";
					readonly name: "s";
					readonly type: "bytes32";
				}
			];
			readonly name: "permit";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "symbol";
			readonly outputs: readonly [
				{
					readonly internalType: "string";
					readonly name: "";
					readonly type: "string";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "totalSupply";
			readonly outputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "to";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "transfer";
			readonly outputs: readonly [
				{
					readonly internalType: "bool";
					readonly name: "";
					readonly type: "bool";
				}
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "from";
					readonly type: "address";
				},
				{
					readonly internalType: "address";
					readonly name: "to";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "transferFrom";
			readonly outputs: readonly [
				{
					readonly internalType: "bool";
					readonly name: "";
					readonly type: "bool";
				}
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		}
	];
	static createInterface(): IERC20ExpInterface;
	static connect(address: string, runner?: ContractRunner | null): IERC20Exp;
}
export declare class IERC20Mintable__factory {
	static readonly abi: readonly [
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "owner";
					readonly type: "address";
				},
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "spender";
					readonly type: "address";
				},
				{
					readonly indexed: false;
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "Approval";
			readonly type: "event";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "from";
					readonly type: "address";
				},
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "to";
					readonly type: "address";
				},
				{
					readonly indexed: false;
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "Transfer";
			readonly type: "event";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "DOMAIN_SEPARATOR";
			readonly outputs: readonly [
				{
					readonly internalType: "bytes32";
					readonly name: "";
					readonly type: "bytes32";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "owner";
					readonly type: "address";
				},
				{
					readonly internalType: "address";
					readonly name: "spender";
					readonly type: "address";
				}
			];
			readonly name: "allowance";
			readonly outputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "spender";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "approve";
			readonly outputs: readonly [
				{
					readonly internalType: "bool";
					readonly name: "";
					readonly type: "bool";
				}
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "account";
					readonly type: "address";
				}
			];
			readonly name: "balanceOf";
			readonly outputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "burn";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "account";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "amount";
					readonly type: "uint256";
				}
			];
			readonly name: "burnFrom";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "decimals";
			readonly outputs: readonly [
				{
					readonly internalType: "uint8";
					readonly name: "";
					readonly type: "uint8";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "to";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "amount";
					readonly type: "uint256";
				}
			];
			readonly name: "mint";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "name";
			readonly outputs: readonly [
				{
					readonly internalType: "string";
					readonly name: "";
					readonly type: "string";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "owner";
					readonly type: "address";
				}
			];
			readonly name: "nonces";
			readonly outputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "owner";
					readonly type: "address";
				},
				{
					readonly internalType: "address";
					readonly name: "spender";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				},
				{
					readonly internalType: "uint256";
					readonly name: "deadline";
					readonly type: "uint256";
				},
				{
					readonly internalType: "uint8";
					readonly name: "v";
					readonly type: "uint8";
				},
				{
					readonly internalType: "bytes32";
					readonly name: "r";
					readonly type: "bytes32";
				},
				{
					readonly internalType: "bytes32";
					readonly name: "s";
					readonly type: "bytes32";
				}
			];
			readonly name: "permit";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "symbol";
			readonly outputs: readonly [
				{
					readonly internalType: "string";
					readonly name: "";
					readonly type: "string";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "totalSupply";
			readonly outputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "to";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "transfer";
			readonly outputs: readonly [
				{
					readonly internalType: "bool";
					readonly name: "";
					readonly type: "bool";
				}
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "from";
					readonly type: "address";
				},
				{
					readonly internalType: "address";
					readonly name: "to";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "transferFrom";
			readonly outputs: readonly [
				{
					readonly internalType: "bool";
					readonly name: "";
					readonly type: "bool";
				}
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		}
	];
	static createInterface(): IERC20MintableInterface;
	static connect(address: string, runner?: ContractRunner | null): IERC20Mintable;
}
export declare class IInitializableProxy__factory {
	static readonly abi: readonly [
		{
			readonly inputs: readonly [
			];
			readonly name: "admin";
			readonly outputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "";
					readonly type: "address";
				}
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "newAdmin";
					readonly type: "address";
				}
			];
			readonly name: "changeAdmin";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "implementation";
			readonly outputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "";
					readonly type: "address";
				}
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "newAdmin";
					readonly type: "address";
				},
				{
					readonly internalType: "address";
					readonly name: "newImplementation";
					readonly type: "address";
				},
				{
					readonly internalType: "bytes";
					readonly name: "data";
					readonly type: "bytes";
				}
			];
			readonly name: "initializeProxy";
			readonly outputs: readonly [
			];
			readonly stateMutability: "payable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "newImplementation";
					readonly type: "address";
				},
				{
					readonly internalType: "bytes";
					readonly name: "data";
					readonly type: "bytes";
				}
			];
			readonly name: "upgradeToAndCall";
			readonly outputs: readonly [
			];
			readonly stateMutability: "payable";
			readonly type: "function";
		}
	];
	static createInterface(): IInitializableProxyInterface;
	static connect(address: string, runner?: ContractRunner | null): IInitializableProxy;
}
export declare class IPriceFeed__factory {
	static readonly abi: readonly [
		{
			readonly inputs: readonly [
			];
			readonly name: "decimals";
			readonly outputs: readonly [
				{
					readonly internalType: "uint8";
					readonly name: "";
					readonly type: "uint8";
				}
			];
			readonly stateMutability: "pure";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "getTokenType";
			readonly outputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "pure";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "latestAnswer";
			readonly outputs: readonly [
				{
					readonly internalType: "int256";
					readonly name: "";
					readonly type: "int256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "latestRound";
			readonly outputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		}
	];
	static createInterface(): IPriceFeedInterface;
	static connect(address: string, runner?: ContractRunner | null): IPriceFeed;
}
export type SigLibConstructorParams = [
	signer?: Signer
] | ConstructorParameters<typeof ContractFactory>;
export declare class SigLib__factory extends ContractFactory {
	constructor(...args: SigLibConstructorParams);
	getDeployTransaction(overrides?: NonPayableOverrides & {
		from?: string;
	}): Promise<ContractDeployTransaction>;
	deploy(overrides?: NonPayableOverrides & {
		from?: string;
	}): Promise<SigLib & {
		deploymentTransaction(): ContractTransactionResponse;
	}>;
	connect(runner: ContractRunner | null): SigLib__factory;
	static readonly bytecode = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea2646970667358221220b1b18f6d1ba71231ce0401dffc88249d9e9c37b67b25f8de5d5c3ada5fa72c3864736f6c634300081e0033";
	static readonly abi: readonly [
		{
			readonly inputs: readonly [
			];
			readonly name: "InvalidSignatureLength";
			readonly type: "error";
		}
	];
	static createInterface(): SigLibInterface;
	static connect(address: string, runner?: ContractRunner | null): SigLib;
}
export type WithSettlerConstructorParams = [
	signer?: Signer
] | ConstructorParameters<typeof ContractFactory>;
export declare class WithSettler__factory extends ContractFactory {
	constructor(...args: WithSettlerConstructorParams);
	getDeployTransaction(overrides?: NonPayableOverrides & {
		from?: string;
	}): Promise<ContractDeployTransaction>;
	deploy(overrides?: NonPayableOverrides & {
		from?: string;
	}): Promise<WithSettler & {
		deploymentTransaction(): ContractTransactionResponse;
	}>;
	connect(runner: ContractRunner | null): WithSettler__factory;
	static readonly bytecode = "0x6080604052348015600f57600080fd5b506108278061001f6000396000f3fe608060405234801561001057600080fd5b506004361061007c5760003560e01c80638da5cb5b1161005b5780638da5cb5b146100b1578063b1da41fe146100f0578063c4d66de814610105578063f2fde38b1461011857600080fd5b8062b105e61461008157806314d3940d14610096578063715018a6146100a9575b600080fd5b61009461008f36600461072f565b61012b565b005b6100946100a436600461072f565b6101cd565b610094610266565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546040516001600160a01b0390911681526020015b60405180910390f35b6100f861027a565b6040516100e79190610758565b61009461011336600461072f565b61028b565b61009461012636600461072f565b610387565b6101336103c5565b61013e600082610420565b6101815760405162461bcd60e51b815260206004820152600f60248201526e24a72b20a624a22fa9a2aa2a2622a960891b60448201526064015b60405180910390fd5b61018c600082610447565b506040516001600160a01b03821681527fc75b24622d5a8552bcfe775a11d9009ac47d4c050a3af79686aebe33f902fc03906020015b60405180910390a150565b6101d56103c5565b6101e0600082610420565b156102215760405162461bcd60e51b8152602060048201526011602482015270222aa82624a1a0aa22afa9a2aa2a2622a960791b6044820152606401610178565b61022c60008261045c565b506040516001600160a01b03821681527f0e8d4de8d62b8ad5b1837a4a13009121b82a40e3bdcd6e6f454a72418cc86b0e906020016101c2565b61026e6103c5565b6102786000610471565b565b606061028660006104e2565b905090565b60006102956104f6565b805490915060ff600160401b820416159067ffffffffffffffff166000811580156102bd5750825b905060008267ffffffffffffffff1660011480156102da5750303b155b9050811580156102e8575080155b156103065760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff19166001178555831561033057845460ff60401b1916600160401b1785555b6103398661051f565b831561037f57845460ff60401b19168555604051600181527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b505050505050565b61038f6103c5565b6001600160a01b0381166103b957604051631e4fbdf760e01b815260006004820152602401610178565b6103c281610471565b50565b336103f77f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546001600160a01b031690565b6001600160a01b0316146102785760405163118cdaa760e01b8152336004820152602401610178565b6001600160a01b038116600090815260018301602052604081205415155b90505b92915050565b600061043e836001600160a01b038416610539565b600061043e836001600160a01b03841661062c565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c19930080546001600160a01b031981166001600160a01b03848116918217845560405192169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a3505050565b606060006104ef8361067b565b9392505050565b6000807ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00610441565b6001600160a01b0381166105305750335b610221816106d7565b6000818152600183016020526040812054801561062257600061055d6001836107a4565b8554909150600090610571906001906107a4565b90508082146105d6576000866000018281548110610591576105916107c5565b90600052602060002001549050808760000184815481106105b4576105b46107c5565b6000918252602080832090910192909255918252600188019052604090208390555b85548690806105e7576105e76107db565b600190038181906000526020600020016000905590558560010160008681526020019081526020016000206000905560019350505050610441565b6000915050610441565b600081815260018301602052604081205461067357508154600181810184556000848152602080822090930184905584548482528286019093526040902091909155610441565b506000610441565b6060816000018054806020026020016040519081016040528092919081815260200182805480156106cb57602002820191906000526020600020905b8154815260200190600101908083116106b7575b50505050509050919050565b6106df6106e8565b6103c28161070d565b6106f0610715565b61027857604051631afcd79f60e31b815260040160405180910390fd5b61038f6106e8565b600061071f6104f6565b54600160401b900460ff16919050565b60006020828403121561074157600080fd5b81356001600160a01b03811681146104ef57600080fd5b602080825282518282018190526000918401906040840190835b818110156107995783516001600160a01b0316835260209384019390920191600101610772565b509095945050505050565b8181038181111561044157634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052603160045260246000fdfea264697066735822122036502885bdeb42ef94581cded74359a853924d3c517c513d8b41d64190c6f7b864736f6c634300081e0033";
	static readonly abi: readonly [
		{
			readonly inputs: readonly [
			];
			readonly name: "InvalidInitialization";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "NotInitializing";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "owner";
					readonly type: "address";
				}
			];
			readonly name: "OwnableInvalidOwner";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "account";
					readonly type: "address";
				}
			];
			readonly name: "OwnableUnauthorizedAccount";
			readonly type: "error";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: false;
					readonly internalType: "address";
					readonly name: "newSettler";
					readonly type: "address";
				}
			];
			readonly name: "AddSettler";
			readonly type: "event";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: false;
					readonly internalType: "uint64";
					readonly name: "version";
					readonly type: "uint64";
				}
			];
			readonly name: "Initialized";
			readonly type: "event";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "previousOwner";
					readonly type: "address";
				},
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "newOwner";
					readonly type: "address";
				}
			];
			readonly name: "OwnershipTransferred";
			readonly type: "event";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: false;
					readonly internalType: "address";
					readonly name: "oldSettler";
					readonly type: "address";
				}
			];
			readonly name: "RemoveSettler";
			readonly type: "event";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "_settler";
					readonly type: "address";
				}
			];
			readonly name: "addSettler";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "_initOwner";
					readonly type: "address";
				}
			];
			readonly name: "initialize";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "owner";
			readonly outputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "";
					readonly type: "address";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "_settler";
					readonly type: "address";
				}
			];
			readonly name: "removeSettler";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "renounceOwnership";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "settlers";
			readonly outputs: readonly [
				{
					readonly internalType: "address[]";
					readonly name: "";
					readonly type: "address[]";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "newOwner";
					readonly type: "address";
				}
			];
			readonly name: "transferOwnership";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		}
	];
	static createInterface(): WithSettlerInterface;
	static connect(address: string, runner?: ContractRunner | null): WithSettler;
}
export type DataFeedConstructorParams = [
	signer?: Signer
] | ConstructorParameters<typeof ContractFactory>;
export declare class DataFeed__factory extends ContractFactory {
	constructor(...args: DataFeedConstructorParams);
	getDeployTransaction(overrides?: NonPayableOverrides & {
		from?: string;
	}): Promise<ContractDeployTransaction>;
	deploy(overrides?: NonPayableOverrides & {
		from?: string;
	}): Promise<DataFeed & {
		deploymentTransaction(): ContractTransactionResponse;
	}>;
	connect(runner: ContractRunner | null): DataFeed__factory;
	static readonly bytecode = "0x60a060405260086080526006600455348015601957600080fd5b5060805161114061003560003960006101a401526111406000f3fe608060405234801561001057600080fd5b50600436106101725760003560e01c80638da5cb5b116100de578063b5ab58dc11610097578063c4d66de811610071578063c4d66de814610398578063d0d552dd146103ab578063f2fde38b146103be578063feaf968c146103d157600080fd5b8063b5ab58dc1461034f578063b633620c1461036f578063bfc12c051461038f57600080fd5b80638da5cb5b1461028a57806390c3f38f146102ba5780639a24a180146102cd5780639a6fc8f5146102e0578063a87a20ce14610327578063b1da41fe1461033a57600080fd5b806350d25bcd1161013057806350d25bcd1461024957806354fd4d5014610252578063668a0f021461025b578063715018a6146102645780637284e4161461026c5780638205bf6a1461028157600080fd5b8062b105e61461017757806314d3940d1461018c578063313ce5671461019f57806338d52e0f146101dd5780633b2235fc14610208578063408def1e14610236575b600080fd5b61018a610185366004610d33565b6103d9565b005b61018a61019a366004610d33565b61047b565b6101c67f000000000000000000000000000000000000000000000000000000000000000081565b60405160ff90911681526020015b60405180910390f35b6002546101f0906001600160a01b031681565b6040516001600160a01b0390911681526020016101d4565b610228610216366004610d4e565b600b6020526000908152604090205481565b6040519081526020016101d4565b61018a610244366004610d4e565b610514565b61022860065481565b61022860045481565b61022860085481565b61018a610521565b610274610535565b6040516101d49190610d67565b61022860075481565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546001600160a01b03166101f0565b61018a6102c8366004610e5a565b6105c3565b61018a6102db366004610e97565b610607565b6102f36102ee366004610ee5565b610644565b604080516001600160501b03968716815260208101959095528401929092526060830152909116608082015260a0016101d4565b61018a610335366004610d4e565b6106c2565b610342610723565b6040516101d49190610f0e565b61022861035d366004610d4e565b60096020526000908152604090205481565b61022861037d366004610d4e565b600a6020526000908152604090205481565b61022860055481565b61018a6103a6366004610d33565b610734565b61018a6103b9366004610d33565b610830565b61018a6103cc366004610d33565b610882565b6102f36108bd565b6103e16108e1565b6103ec60008261093c565b61042f5760405162461bcd60e51b815260206004820152600f60248201526e24a72b20a624a22fa9a2aa2a2622a960891b60448201526064015b60405180910390fd5b61043a600082610963565b506040516001600160a01b03821681527fc75b24622d5a8552bcfe775a11d9009ac47d4c050a3af79686aebe33f902fc03906020015b60405180910390a150565b6104836108e1565b61048e60008261093c565b156104cf5760405162461bcd60e51b8152602060048201526011602482015270222aa82624a1a0aa22afa9a2aa2a2622a960791b6044820152606401610426565b6104da600082610978565b506040516001600160a01b03821681527f0e8d4de8d62b8ad5b1837a4a13009121b82a40e3bdcd6e6f454a72418cc86b0e90602001610470565b61051c6108e1565b600455565b6105296108e1565b610533600061098d565b565b6003805461054290610f5a565b80601f016020809104026020016040519081016040528092919081815260200182805461056e90610f5a565b80156105bb5780601f10610590576101008083540402835291602001916105bb565b820191906000526020600020905b81548152906001019060200180831161059e57829003601f168201915b505050505081565b6105cb6108e1565b60036105d78282610fe3565b507f16fbb51445345dabaa215e5f99a4bd4d8ba9818b508c76d5cd0ea30abcc491c6816040516104709190610d67565b61060f6108e1565b60055460000361061e57426005555b60045460000361062e5760066004555b61063782610830565b610640816105c3565b5050565b6001600160501b0381166000818152600960205260408120548392909190819081906106725760055461069a565b600a600061068a60016001600160501b038a166110b8565b8152602001908152602001600020545b6001600160501b0387166000908152600a602052604090205495979496909594909350915050565b6106cd60003361093c565b6107075760405162461bcd60e51b815260206004820152600b60248201526a2727aa2fa9a2aa2a2622a960a91b6044820152606401610426565b61072081600854600161071a91906110cb565b426109fe565b50565b606061072f6000610aca565b905090565b600061073e610ade565b805490915060ff600160401b820416159067ffffffffffffffff166000811580156107665750825b905060008267ffffffffffffffff1660011480156107835750303b155b905081158015610791575080155b156107af5760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff1916600117855583156107d957845460ff60401b1916600160401b1785555b6107e286610b07565b831561082857845460ff60401b19168555604051600181527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b505050505050565b6108386108e1565b600280546001600160a01b0319166001600160a01b0383169081179091556040517fc7d9598af6004de7fa9c489a50a55414c75cfbce9fe56fe46956970744d6bc2c90600090a250565b61088a6108e1565b6001600160a01b0381166108b457604051631e4fbdf760e01b815260006004820152602401610426565b6107208161098d565b60008060008060006108d0600854610644565b945094509450945094509091929394565b336109137f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546001600160a01b031690565b6001600160a01b0316146105335760405163118cdaa760e01b8152336004820152602401610426565b6001600160a01b038116600090815260018301602052604081205415155b90505b92915050565b600061095a836001600160a01b038416610b21565b600061095a836001600160a01b038416610c14565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c19930080546001600160a01b031981166001600160a01b03848116918217845560405192169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a3505050565b8060075410610a0c57505050565b6006839055600781905560088290556000828152600a6020908152604080832080546009845282852088905590859055848452600b909252909120849055151580610a8957604051828152339084907f0109fc6f55cf40689f02fbaad7af7fe7bbac8a3d2186600afc7d3e10cac602719060200160405180910390a35b82847f0559884fd3a460db3073b7fc896cc77986f16e378210ded43186175bf646fc5f84604051610abc91815260200190565b60405180910390a350505050565b60606000610ad783610c63565b9392505050565b6000807ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a0061095d565b6001600160a01b038116610b185750335b6104cf81610cbf565b60008181526001830160205260408120548015610c0a576000610b456001836110b8565b8554909150600090610b59906001906110b8565b9050808214610bbe576000866000018281548110610b7957610b796110de565b9060005260206000200154905080876000018481548110610b9c57610b9c6110de565b6000918252602080832090910192909255918252600188019052604090208390555b8554869080610bcf57610bcf6110f4565b60019003818190600052602060002001600090559055856001016000868152602001908152602001600020600090556001935050505061095d565b600091505061095d565b6000818152600183016020526040812054610c5b5750815460018181018455600084815260208082209093018490558454848252828601909352604090209190915561095d565b50600061095d565b606081600001805480602002602001604051908101604052809291908181526020018280548015610cb357602002820191906000526020600020905b815481526020019060010190808311610c9f575b50505050509050919050565b610cc7610cd0565b61072081610cf5565b610cd8610cfd565b61053357604051631afcd79f60e31b815260040160405180910390fd5b61088a610cd0565b6000610d07610ade565b54600160401b900460ff16919050565b80356001600160a01b0381168114610d2e57600080fd5b919050565b600060208284031215610d4557600080fd5b61095a82610d17565b600060208284031215610d6057600080fd5b5035919050565b602081526000825180602084015260005b81811015610d955760208186018101516040868401015201610d78565b506000604082850101526040601f19601f83011684010191505092915050565b634e487b7160e01b600052604160045260246000fd5b600082601f830112610ddc57600080fd5b813567ffffffffffffffff811115610df657610df6610db5565b604051601f8201601f19908116603f0116810167ffffffffffffffff81118282101715610e2557610e25610db5565b604052818152838201602001851015610e3d57600080fd5b816020850160208301376000918101602001919091529392505050565b600060208284031215610e6c57600080fd5b813567ffffffffffffffff811115610e8357600080fd5b610e8f84828501610dcb565b949350505050565b60008060408385031215610eaa57600080fd5b610eb383610d17565b9150602083013567ffffffffffffffff811115610ecf57600080fd5b610edb85828601610dcb565b9150509250929050565b600060208284031215610ef757600080fd5b81356001600160501b0381168114610ad757600080fd5b602080825282518282018190526000918401906040840190835b81811015610f4f5783516001600160a01b0316835260209384019390920191600101610f28565b509095945050505050565b600181811c90821680610f6e57607f821691505b602082108103610f8e57634e487b7160e01b600052602260045260246000fd5b50919050565b601f821115610fde57806000526020600020601f840160051c81016020851015610fbb5750805b601f840160051c820191505b81811015610fdb5760008155600101610fc7565b50505b505050565b815167ffffffffffffffff811115610ffd57610ffd610db5565b6110118161100b8454610f5a565b84610f94565b6020601f821160018114611045576000831561102d5750848201515b600019600385901b1c1916600184901b178455610fdb565b600084815260208120601f198516915b828110156110755787850151825560209485019460019092019101611055565b50848210156110935786840151600019600387901b60f8161c191681555b50505050600190811b01905550565b634e487b7160e01b600052601160045260246000fd5b8181038181111561095d5761095d6110a2565b8082018082111561095d5761095d6110a2565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052603160045260246000fdfea2646970667358221220320a5d9099684216cab93f19e7af47e160edb5c3e996b1b58ea94d8872ec123a64736f6c634300081e0033";
	static readonly abi: readonly [
		{
			readonly inputs: readonly [
			];
			readonly name: "InvalidInitialization";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "NotInitializing";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "owner";
					readonly type: "address";
				}
			];
			readonly name: "OwnableInvalidOwner";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "account";
					readonly type: "address";
				}
			];
			readonly name: "OwnableUnauthorizedAccount";
			readonly type: "error";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: false;
					readonly internalType: "address";
					readonly name: "newSettler";
					readonly type: "address";
				}
			];
			readonly name: "AddSettler";
			readonly type: "event";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: true;
					readonly internalType: "int256";
					readonly name: "current";
					readonly type: "int256";
				},
				{
					readonly indexed: true;
					readonly internalType: "uint256";
					readonly name: "roundId";
					readonly type: "uint256";
				},
				{
					readonly indexed: false;
					readonly internalType: "uint256";
					readonly name: "updatedAt";
					readonly type: "uint256";
				}
			];
			readonly name: "AnswerUpdated";
			readonly type: "event";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: false;
					readonly internalType: "uint64";
					readonly name: "version";
					readonly type: "uint64";
				}
			];
			readonly name: "Initialized";
			readonly type: "event";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "asset";
					readonly type: "address";
				}
			];
			readonly name: "NewAsset";
			readonly type: "event";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: false;
					readonly internalType: "string";
					readonly name: "description";
					readonly type: "string";
				}
			];
			readonly name: "NewDescription";
			readonly type: "event";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: true;
					readonly internalType: "uint256";
					readonly name: "roundId";
					readonly type: "uint256";
				},
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "startedBy";
					readonly type: "address";
				},
				{
					readonly indexed: false;
					readonly internalType: "uint256";
					readonly name: "startedAt";
					readonly type: "uint256";
				}
			];
			readonly name: "NewRound";
			readonly type: "event";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "previousOwner";
					readonly type: "address";
				},
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "newOwner";
					readonly type: "address";
				}
			];
			readonly name: "OwnershipTransferred";
			readonly type: "event";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: false;
					readonly internalType: "address";
					readonly name: "oldSettler";
					readonly type: "address";
				}
			];
			readonly name: "RemoveSettler";
			readonly type: "event";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "_settler";
					readonly type: "address";
				}
			];
			readonly name: "addSettler";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "asset";
			readonly outputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "";
					readonly type: "address";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "decimals";
			readonly outputs: readonly [
				{
					readonly internalType: "uint8";
					readonly name: "";
					readonly type: "uint8";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "deploymentTimestamp";
			readonly outputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "description";
			readonly outputs: readonly [
				{
					readonly internalType: "string";
					readonly name: "";
					readonly type: "string";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly name: "getAnswer";
			readonly outputs: readonly [
				{
					readonly internalType: "int256";
					readonly name: "";
					readonly type: "int256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "uint80";
					readonly name: "_roundId";
					readonly type: "uint80";
				}
			];
			readonly name: "getRoundData";
			readonly outputs: readonly [
				{
					readonly internalType: "uint80";
					readonly name: "roundId";
					readonly type: "uint80";
				},
				{
					readonly internalType: "int256";
					readonly name: "answer";
					readonly type: "int256";
				},
				{
					readonly internalType: "uint256";
					readonly name: "startedAt";
					readonly type: "uint256";
				},
				{
					readonly internalType: "uint256";
					readonly name: "updatedAt";
					readonly type: "uint256";
				},
				{
					readonly internalType: "uint80";
					readonly name: "answeredInRound";
					readonly type: "uint80";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly name: "getTimestamp";
			readonly outputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly name: "getTimestampAnswer";
			readonly outputs: readonly [
				{
					readonly internalType: "int256";
					readonly name: "";
					readonly type: "int256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "_initOwner";
					readonly type: "address";
				}
			];
			readonly name: "initialize";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "latestAnswer";
			readonly outputs: readonly [
				{
					readonly internalType: "int256";
					readonly name: "";
					readonly type: "int256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "latestRound";
			readonly outputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "latestRoundData";
			readonly outputs: readonly [
				{
					readonly internalType: "uint80";
					readonly name: "";
					readonly type: "uint80";
				},
				{
					readonly internalType: "int256";
					readonly name: "";
					readonly type: "int256";
				},
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				},
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				},
				{
					readonly internalType: "uint80";
					readonly name: "";
					readonly type: "uint80";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "latestTimestamp";
			readonly outputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "owner";
			readonly outputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "";
					readonly type: "address";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "_settler";
					readonly type: "address";
				}
			];
			readonly name: "removeSettler";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "renounceOwnership";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "_asset";
					readonly type: "address";
				}
			];
			readonly name: "setAsset";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "string";
					readonly name: "_description";
					readonly type: "string";
				}
			];
			readonly name: "setDescription";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "_asset";
					readonly type: "address";
				},
				{
					readonly internalType: "string";
					readonly name: "_description";
					readonly type: "string";
				}
			];
			readonly name: "setFeedInfo";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "_version";
					readonly type: "uint256";
				}
			];
			readonly name: "setVersion";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "settlers";
			readonly outputs: readonly [
				{
					readonly internalType: "address[]";
					readonly name: "";
					readonly type: "address[]";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "newOwner";
					readonly type: "address";
				}
			];
			readonly name: "transferOwnership";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "int256";
					readonly name: "newAnswer";
					readonly type: "int256";
				}
			];
			readonly name: "updateAnswer";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "version";
			readonly outputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		}
	];
	static createInterface(): DataFeedInterface;
	static connect(address: string, runner?: ContractRunner | null): DataFeed;
}
export type InitializableProxyConstructorParams = [
	signer?: Signer
] | ConstructorParameters<typeof ContractFactory>;
export declare class InitializableProxy__factory extends ContractFactory {
	constructor(...args: InitializableProxyConstructorParams);
	getDeployTransaction(overrides?: NonPayableOverrides & {
		from?: string;
	}): Promise<ContractDeployTransaction>;
	deploy(overrides?: NonPayableOverrides & {
		from?: string;
	}): Promise<InitializableProxy & {
		deploymentTransaction(): ContractTransactionResponse;
	}>;
	connect(runner: ContractRunner | null): InitializableProxy__factory;
	static readonly bytecode = "0x6080604052348015600f57600080fd5b506106f18061001f6000396000f3fe60806040526004361061004e5760003560e01c80634f1ef286146100655780635c60da1b146100785780638f283970146100a9578063dce95104146100c9578063f851a440146100dc5761005d565b3661005d5761005b6100f1565b005b61005b6100f1565b61005b6100733660046105be565b610103565b34801561008457600080fd5b5061008d61016a565b6040516001600160a01b03909116815260200160405180910390f35b3480156100b557600080fd5b5061005b6100c436600461060c565b610179565b61005b6100d736600461062e565b6101d9565b3480156100e857600080fd5b5061008d610263565b6101016100fc61026d565b610277565b565b61010b61029b565b6001600160a01b0316336001600160a01b03161461015c5760405162461bcd60e51b81526020600482015260096024820152682727aa2fa0a226a4a760b91b60448201526064015b60405180910390fd5b61016682826102a5565b5050565b600061017461026d565b905090565b61018161029b565b6001600160a01b0316336001600160a01b0316146101cd5760405162461bcd60e51b81526020600482015260096024820152682727aa2fa0a226a4a760b91b6044820152606401610153565b6101d681610364565b50565b60006101e361026d565b6001600160a01b0316148015610209575060006101fe61029b565b6001600160a01b0316145b61024b5760405162461bcd60e51b81526020600482015260136024820152721053149150511657d253925512505312569151606a1b6044820152606401610153565b61025483610364565b61025e82826102a5565b505050565b600061017461029b565b60006101746103b8565b3660008037600080366000845af43d6000803e808015610296573d6000f35b3d6000fd5b60006101746103eb565b6102ae82610413565b6040516001600160a01b038316907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a280511561035c57600080836001600160a01b031683604051610304919061068c565b600060405180830381855af49150503d806000811461033f576040519150601f19603f3d011682016040523d82523d6000602084013e610344565b606091505b50915091508161035657805181602001fd5b50505050565b61016661048d565b7f7e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798f61038d6103eb565b604080516001600160a01b03928316815291841660208301520160405180910390a16101d6816104ac565b60007f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc5b546001600160a01b0316919050565b60007fb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d61036103dc565b806001600160a01b03163b60000361044957604051634c9c8ce360e01b81526001600160a01b0382166004820152602401610153565b807f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc5b80546001600160a01b0319166001600160a01b039290921691909117905550565b34156101015760405163b398979f60e01b815260040160405180910390fd5b6001600160a01b0381166104d657604051633173bdd160e11b815260006004820152602401610153565b807fb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d610361046c565b80356001600160a01b038116811461051457600080fd5b919050565b634e487b7160e01b600052604160045260246000fd5b600082601f83011261054057600080fd5b813567ffffffffffffffff81111561055a5761055a610519565b604051601f8201601f19908116603f0116810167ffffffffffffffff8111828210171561058957610589610519565b6040528181528382016020018510156105a157600080fd5b816020850160208301376000918101602001919091529392505050565b600080604083850312156105d157600080fd5b6105da836104fd565b9150602083013567ffffffffffffffff8111156105f657600080fd5b6106028582860161052f565b9150509250929050565b60006020828403121561061e57600080fd5b610627826104fd565b9392505050565b60008060006060848603121561064357600080fd5b61064c846104fd565b925061065a602085016104fd565b9150604084013567ffffffffffffffff81111561067657600080fd5b6106828682870161052f565b9150509250925092565b6000825160005b818110156106ad5760208186018101518583015201610693565b50600092019182525091905056fea264697066735822122060f2d8c3e6d33dcf20d6bde176c3b5d3e275fac216bdfb5236fa4d1a5f0648ff64736f6c634300081e0033";
	static readonly abi: readonly [
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "admin";
					readonly type: "address";
				}
			];
			readonly name: "ERC1967InvalidAdmin";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "implementation";
					readonly type: "address";
				}
			];
			readonly name: "ERC1967InvalidImplementation";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "ERC1967NonPayable";
			readonly type: "error";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: false;
					readonly internalType: "address";
					readonly name: "previousAdmin";
					readonly type: "address";
				},
				{
					readonly indexed: false;
					readonly internalType: "address";
					readonly name: "newAdmin";
					readonly type: "address";
				}
			];
			readonly name: "AdminChanged";
			readonly type: "event";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "implementation";
					readonly type: "address";
				}
			];
			readonly name: "Upgraded";
			readonly type: "event";
		},
		{
			readonly stateMutability: "payable";
			readonly type: "fallback";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "admin";
			readonly outputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "";
					readonly type: "address";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "newAdmin";
					readonly type: "address";
				}
			];
			readonly name: "changeAdmin";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "implementation";
			readonly outputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "";
					readonly type: "address";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "newAdmin";
					readonly type: "address";
				},
				{
					readonly internalType: "address";
					readonly name: "newImplementation";
					readonly type: "address";
				},
				{
					readonly internalType: "bytes";
					readonly name: "data";
					readonly type: "bytes";
				}
			];
			readonly name: "initializeProxy";
			readonly outputs: readonly [
			];
			readonly stateMutability: "payable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "newImplementation";
					readonly type: "address";
				},
				{
					readonly internalType: "bytes";
					readonly name: "data";
					readonly type: "bytes";
				}
			];
			readonly name: "upgradeToAndCall";
			readonly outputs: readonly [
			];
			readonly stateMutability: "payable";
			readonly type: "function";
		},
		{
			readonly stateMutability: "payable";
			readonly type: "receive";
		}
	];
	static createInterface(): InitializableProxyInterface;
	static connect(address: string, runner?: ContractRunner | null): InitializableProxy;
}
export type ERC20MockConstructorParams = [
	signer?: Signer
] | ConstructorParameters<typeof ContractFactory>;
export declare class ERC20Mock__factory extends ContractFactory {
	constructor(...args: ERC20MockConstructorParams);
	getDeployTransaction(name_: string, symbol_: string, decimals_: BigNumberish, supply_: BigNumberish, overrides?: NonPayableOverrides & {
		from?: string;
	}): Promise<ContractDeployTransaction>;
	deploy(name_: string, symbol_: string, decimals_: BigNumberish, supply_: BigNumberish, overrides?: NonPayableOverrides & {
		from?: string;
	}): Promise<ERC20Mock & {
		deploymentTransaction(): ContractTransactionResponse;
	}>;
	connect(runner: ContractRunner | null): ERC20Mock__factory;
	static readonly bytecode = "0x61018060405234801561001157600080fd5b506040516118a63803806118a68339810160408190526100309161045f565b338480604051806040016040528060018152602001603160f81b8152508787816003908161005e9190610571565b50600461006b8282610571565b5061007b91508390506005610175565b6101205261008a816006610175565b61014052815160208084019190912060e052815190820120610100524660a05261011760e05161010051604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f60208201529081019290925260608201524660808201523060a082015260009060c00160405160208183030381529060405280519060200120905090565b60805250503060c052506001600160a01b03811661015057604051631e4fbdf760e01b8152600060048201526024015b60405180910390fd5b610159816101a8565b5060ff82166101605261016c33826101fa565b505050506106a7565b60006020835110156101915761018a83610234565b90506101a2565b8161019c8482610571565b5060ff90505b92915050565b600880546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b6001600160a01b0382166102245760405163ec442f0560e01b815260006004820152602401610147565b61023060008383610272565b5050565b600080829050601f8151111561025f578260405163305a27a960e01b8152600401610147919061062f565b805161026a82610662565b179392505050565b6001600160a01b03831661029d5780600260008282546102929190610686565b9091555061030f9050565b6001600160a01b038316600090815260208190526040902054818110156102f05760405163391434e360e21b81526001600160a01b03851660048201526024810182905260448101839052606401610147565b6001600160a01b03841660009081526020819052604090209082900390555b6001600160a01b03821661032b5760028054829003905561034a565b6001600160a01b03821660009081526020819052604090208054820190555b816001600160a01b0316836001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8360405161038f91815260200190565b60405180910390a3505050565b634e487b7160e01b600052604160045260246000fd5b60005b838110156103cd5781810151838201526020016103b5565b50506000910152565b600082601f8301126103e757600080fd5b81516001600160401b038111156104005761040061039c565b604051601f8201601f19908116603f011681016001600160401b038111828210171561042e5761042e61039c565b60405281815283820160200185101561044657600080fd5b6104578260208301602087016103b2565b949350505050565b6000806000806080858703121561047557600080fd5b84516001600160401b0381111561048b57600080fd5b610497878288016103d6565b602087015190955090506001600160401b038111156104b557600080fd5b6104c1878288016103d6565b935050604085015160ff811681146104d857600080fd5b6060959095015193969295505050565b600181811c908216806104fc57607f821691505b60208210810361051c57634e487b7160e01b600052602260045260246000fd5b50919050565b601f82111561056c57806000526020600020601f840160051c810160208510156105495750805b601f840160051c820191505b818110156105695760008155600101610555565b50505b505050565b81516001600160401b0381111561058a5761058a61039c565b61059e8161059884546104e8565b84610522565b6020601f8211600181146105d257600083156105ba5750848201515b600019600385901b1c1916600184901b178455610569565b600084815260208120601f198516915b8281101561060257878501518255602094850194600190920191016105e2565b50848210156106205786840151600019600387901b60f8161c191681555b50505050600190811b01905550565b602081526000825180602084015261064e8160408501602087016103b2565b601f01601f19169190910160400192915050565b8051602080830151919081101561051c5760001960209190910360031b1b16919050565b808201808211156101a257634e487b7160e01b600052601160045260246000fd5b60805160a05160c05160e0516101005161012051610140516101605161119a61070c600039600061019e015260006109840152600061095701526000610814015260006107ec01526000610747015260006107710152600061079b015261119a6000f3fe608060405234801561001057600080fd5b506004361061012c5760003560e01c806379cc6790116100ad578063a0712d6811610071578063a0712d681461028d578063a9059cbb146102a0578063d505accf146102b3578063dd62ed3e146102c6578063f2fde38b146102ff57600080fd5b806379cc6790146102295780637ecebe001461023c57806384b0196e1461024f5780638da5cb5b1461026a57806395d89b411461028557600080fd5b80633644e515116100f45780633644e515146101c857806340c10f19146101d057806342966c68146101e557806370a08231146101f8578063715018a61461022157600080fd5b806306fdde0314610131578063095ea7b31461014f57806318160ddd1461017257806323b872dd14610184578063313ce56714610197575b600080fd5b610139610312565b6040516101469190610ee4565b60405180910390f35b61016261015d366004610f1a565b6103a4565b6040519015158152602001610146565b6002545b604051908152602001610146565b610162610192366004610f44565b6103be565b60405160ff7f0000000000000000000000000000000000000000000000000000000000000000168152602001610146565b6101766103e2565b6101e36101de366004610f1a565b6103f1565b005b6101e36101f3366004610f81565b610407565b610176610206366004610f9a565b6001600160a01b031660009081526020819052604090205490565b6101e3610414565b6101e3610237366004610f1a565b610428565b61017661024a366004610f9a565b61043d565b61025761045b565b6040516101469796959493929190610fb5565b6008546040516001600160a01b039091168152602001610146565b6101396104a1565b6101e361029b366004610f81565b6104b0565b6101626102ae366004610f1a565b6104c2565b6101e36102c136600461104d565b6104d0565b6101766102d43660046110c0565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b6101e361030d366004610f9a565b61060f565b606060038054610321906110f3565b80601f016020809104026020016040519081016040528092919081815260200182805461034d906110f3565b801561039a5780601f1061036f5761010080835404028352916020019161039a565b820191906000526020600020905b81548152906001019060200180831161037d57829003601f168201915b5050505050905090565b6000336103b281858561064a565b60019150505b92915050565b6000336103cc85828561065c565b6103d78585856106db565b506001949350505050565b60006103ec61073a565b905090565b6103f9610865565b6104038282610892565b5050565b61041133826108c8565b50565b61041c610865565b61042660006108fe565b565b61043382338361065c565b61040382826108c8565b6001600160a01b0381166000908152600760205260408120546103b8565b60006060806000806000606061046f610950565b61047761097d565b60408051600080825260208201909252600f60f81b9b939a50919850469750309650945092509050565b606060048054610321906110f3565b6104b8610865565b6104113382610892565b6000336103b28185856106db565b834211156104f95760405163313c898160e11b8152600481018590526024015b60405180910390fd5b60007f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c98888886105468c6001600160a01b0316600090815260076020526040902080546001810190915590565b6040805160208101969096526001600160a01b0394851690860152929091166060840152608083015260a082015260c0810186905260e00160405160208183030381529060405280519060200120905060006105a1826109aa565b905060006105b1828787876109d7565b9050896001600160a01b0316816001600160a01b0316146105f8576040516325c0072360e11b81526001600160a01b0380831660048301528b1660248201526044016104f0565b6106038a8a8a61064a565b50505050505050505050565b610617610865565b6001600160a01b03811661064157604051631e4fbdf760e01b8152600060048201526024016104f0565b610411816108fe565b6106578383836001610a05565b505050565b6001600160a01b038381166000908152600160209081526040808320938616835292905220546000198110156106d557818110156106c657604051637dc7a0d960e11b81526001600160a01b038416600482015260248101829052604481018390526064016104f0565b6106d584848484036000610a05565b50505050565b6001600160a01b03831661070557604051634b637e8f60e11b8152600060048201526024016104f0565b6001600160a01b03821661072f5760405163ec442f0560e01b8152600060048201526024016104f0565b610657838383610ada565b6000306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614801561079357507f000000000000000000000000000000000000000000000000000000000000000046145b156107bd57507f000000000000000000000000000000000000000000000000000000000000000090565b6103ec604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f60208201527f0000000000000000000000000000000000000000000000000000000000000000918101919091527f000000000000000000000000000000000000000000000000000000000000000060608201524660808201523060a082015260009060c00160405160208183030381529060405280519060200120905090565b6008546001600160a01b031633146104265760405163118cdaa760e01b81523360048201526024016104f0565b6001600160a01b0382166108bc5760405163ec442f0560e01b8152600060048201526024016104f0565b61040360008383610ada565b6001600160a01b0382166108f257604051634b637e8f60e11b8152600060048201526024016104f0565b61040382600083610ada565b600880546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b60606103ec7f00000000000000000000000000000000000000000000000000000000000000006005610c04565b60606103ec7f00000000000000000000000000000000000000000000000000000000000000006006610c04565b60006103b86109b761073a565b8360405161190160f01b8152600281019290925260228201526042902090565b6000806000806109e988888888610caf565b9250925092506109f98282610d7e565b50909695505050505050565b6001600160a01b038416610a2f5760405163e602df0560e01b8152600060048201526024016104f0565b6001600160a01b038316610a5957604051634a1406b160e11b8152600060048201526024016104f0565b6001600160a01b03808516600090815260016020908152604080832093871683529290522082905580156106d557826001600160a01b0316846001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92584604051610acc91815260200190565b60405180910390a350505050565b6001600160a01b038316610b05578060026000828254610afa919061112d565b90915550610b779050565b6001600160a01b03831660009081526020819052604090205481811015610b585760405163391434e360e21b81526001600160a01b038516600482015260248101829052604481018390526064016104f0565b6001600160a01b03841660009081526020819052604090209082900390555b6001600160a01b038216610b9357600280548290039055610bb2565b6001600160a01b03821660009081526020819052604090208054820190555b816001600160a01b0316836001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051610bf791815260200190565b60405180910390a3505050565b606060ff8314610c1e57610c1783610e37565b90506103b8565b818054610c2a906110f3565b80601f0160208091040260200160405190810160405280929190818152602001828054610c56906110f3565b8015610ca35780601f10610c7857610100808354040283529160200191610ca3565b820191906000526020600020905b815481529060010190602001808311610c8657829003601f168201915b505050505090506103b8565b600080807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0841115610cea5750600091506003905082610d74565b604080516000808252602082018084528a905260ff891692820192909252606081018790526080810186905260019060a0016020604051602081039080840390855afa158015610d3e573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b038116610d6a57506000925060019150829050610d74565b9250600091508190505b9450945094915050565b6000826003811115610d9257610d9261114e565b03610d9b575050565b6001826003811115610daf57610daf61114e565b03610dcd5760405163f645eedf60e01b815260040160405180910390fd5b6002826003811115610de157610de161114e565b03610e025760405163fce698f760e01b8152600481018290526024016104f0565b6003826003811115610e1657610e1661114e565b03610403576040516335e2f38360e21b8152600481018290526024016104f0565b60606000610e4483610e76565b604080516020808252818301909252919250600091906020820181803683375050509182525060208101929092525090565b600060ff8216601f8111156103b857604051632cd44ac360e21b815260040160405180910390fd5b6000815180845260005b81811015610ec457602081850181015186830182015201610ea8565b506000602082860101526020601f19601f83011685010191505092915050565b602081526000610ef76020830184610e9e565b9392505050565b80356001600160a01b0381168114610f1557600080fd5b919050565b60008060408385031215610f2d57600080fd5b610f3683610efe565b946020939093013593505050565b600080600060608486031215610f5957600080fd5b610f6284610efe565b9250610f7060208501610efe565b929592945050506040919091013590565b600060208284031215610f9357600080fd5b5035919050565b600060208284031215610fac57600080fd5b610ef782610efe565b60ff60f81b8816815260e060208201526000610fd460e0830189610e9e565b8281036040840152610fe68189610e9e565b606084018890526001600160a01b038716608085015260a0840186905283810360c08501528451808252602080870193509091019060005b8181101561103c57835183526020938401939092019160010161101e565b50909b9a5050505050505050505050565b600080600080600080600060e0888a03121561106857600080fd5b61107188610efe565b965061107f60208901610efe565b95506040880135945060608801359350608088013560ff811681146110a357600080fd5b9699959850939692959460a0840135945060c09093013592915050565b600080604083850312156110d357600080fd5b6110dc83610efe565b91506110ea60208401610efe565b90509250929050565b600181811c9082168061110757607f821691505b60208210810361112757634e487b7160e01b600052602260045260246000fd5b50919050565b808201808211156103b857634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052602160045260246000fdfea2646970667358221220e9528b06a476d08178b33e3a6c53a1a9f5f7c141dd9cc04cc1ddb61fc078596364736f6c634300081e0033";
	static readonly abi: readonly [
		{
			readonly inputs: readonly [
				{
					readonly internalType: "string";
					readonly name: "name_";
					readonly type: "string";
				},
				{
					readonly internalType: "string";
					readonly name: "symbol_";
					readonly type: "string";
				},
				{
					readonly internalType: "uint8";
					readonly name: "decimals_";
					readonly type: "uint8";
				},
				{
					readonly internalType: "uint256";
					readonly name: "supply_";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "nonpayable";
			readonly type: "constructor";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "ECDSAInvalidSignature";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "length";
					readonly type: "uint256";
				}
			];
			readonly name: "ECDSAInvalidSignatureLength";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "bytes32";
					readonly name: "s";
					readonly type: "bytes32";
				}
			];
			readonly name: "ECDSAInvalidSignatureS";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "spender";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "allowance";
					readonly type: "uint256";
				},
				{
					readonly internalType: "uint256";
					readonly name: "needed";
					readonly type: "uint256";
				}
			];
			readonly name: "ERC20InsufficientAllowance";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "sender";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "balance";
					readonly type: "uint256";
				},
				{
					readonly internalType: "uint256";
					readonly name: "needed";
					readonly type: "uint256";
				}
			];
			readonly name: "ERC20InsufficientBalance";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "approver";
					readonly type: "address";
				}
			];
			readonly name: "ERC20InvalidApprover";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "receiver";
					readonly type: "address";
				}
			];
			readonly name: "ERC20InvalidReceiver";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "sender";
					readonly type: "address";
				}
			];
			readonly name: "ERC20InvalidSender";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "spender";
					readonly type: "address";
				}
			];
			readonly name: "ERC20InvalidSpender";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "deadline";
					readonly type: "uint256";
				}
			];
			readonly name: "ERC2612ExpiredSignature";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "signer";
					readonly type: "address";
				},
				{
					readonly internalType: "address";
					readonly name: "owner";
					readonly type: "address";
				}
			];
			readonly name: "ERC2612InvalidSigner";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "account";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "currentNonce";
					readonly type: "uint256";
				}
			];
			readonly name: "InvalidAccountNonce";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "InvalidShortString";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "owner";
					readonly type: "address";
				}
			];
			readonly name: "OwnableInvalidOwner";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "account";
					readonly type: "address";
				}
			];
			readonly name: "OwnableUnauthorizedAccount";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "string";
					readonly name: "str";
					readonly type: "string";
				}
			];
			readonly name: "StringTooLong";
			readonly type: "error";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "owner";
					readonly type: "address";
				},
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "spender";
					readonly type: "address";
				},
				{
					readonly indexed: false;
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "Approval";
			readonly type: "event";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
			];
			readonly name: "EIP712DomainChanged";
			readonly type: "event";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "previousOwner";
					readonly type: "address";
				},
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "newOwner";
					readonly type: "address";
				}
			];
			readonly name: "OwnershipTransferred";
			readonly type: "event";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "from";
					readonly type: "address";
				},
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "to";
					readonly type: "address";
				},
				{
					readonly indexed: false;
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "Transfer";
			readonly type: "event";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "DOMAIN_SEPARATOR";
			readonly outputs: readonly [
				{
					readonly internalType: "bytes32";
					readonly name: "";
					readonly type: "bytes32";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "owner";
					readonly type: "address";
				},
				{
					readonly internalType: "address";
					readonly name: "spender";
					readonly type: "address";
				}
			];
			readonly name: "allowance";
			readonly outputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "spender";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "approve";
			readonly outputs: readonly [
				{
					readonly internalType: "bool";
					readonly name: "";
					readonly type: "bool";
				}
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "account";
					readonly type: "address";
				}
			];
			readonly name: "balanceOf";
			readonly outputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "burn";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "account";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "burnFrom";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "decimals";
			readonly outputs: readonly [
				{
					readonly internalType: "uint8";
					readonly name: "";
					readonly type: "uint8";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "eip712Domain";
			readonly outputs: readonly [
				{
					readonly internalType: "bytes1";
					readonly name: "fields";
					readonly type: "bytes1";
				},
				{
					readonly internalType: "string";
					readonly name: "name";
					readonly type: "string";
				},
				{
					readonly internalType: "string";
					readonly name: "version";
					readonly type: "string";
				},
				{
					readonly internalType: "uint256";
					readonly name: "chainId";
					readonly type: "uint256";
				},
				{
					readonly internalType: "address";
					readonly name: "verifyingContract";
					readonly type: "address";
				},
				{
					readonly internalType: "bytes32";
					readonly name: "salt";
					readonly type: "bytes32";
				},
				{
					readonly internalType: "uint256[]";
					readonly name: "extensions";
					readonly type: "uint256[]";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "to";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "amount";
					readonly type: "uint256";
				}
			];
			readonly name: "mint";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "amount";
					readonly type: "uint256";
				}
			];
			readonly name: "mint";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "name";
			readonly outputs: readonly [
				{
					readonly internalType: "string";
					readonly name: "";
					readonly type: "string";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "owner";
					readonly type: "address";
				}
			];
			readonly name: "nonces";
			readonly outputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "owner";
			readonly outputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "";
					readonly type: "address";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "owner";
					readonly type: "address";
				},
				{
					readonly internalType: "address";
					readonly name: "spender";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				},
				{
					readonly internalType: "uint256";
					readonly name: "deadline";
					readonly type: "uint256";
				},
				{
					readonly internalType: "uint8";
					readonly name: "v";
					readonly type: "uint8";
				},
				{
					readonly internalType: "bytes32";
					readonly name: "r";
					readonly type: "bytes32";
				},
				{
					readonly internalType: "bytes32";
					readonly name: "s";
					readonly type: "bytes32";
				}
			];
			readonly name: "permit";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "renounceOwnership";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "symbol";
			readonly outputs: readonly [
				{
					readonly internalType: "string";
					readonly name: "";
					readonly type: "string";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "totalSupply";
			readonly outputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "to";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "transfer";
			readonly outputs: readonly [
				{
					readonly internalType: "bool";
					readonly name: "";
					readonly type: "bool";
				}
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "from";
					readonly type: "address";
				},
				{
					readonly internalType: "address";
					readonly name: "to";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "transferFrom";
			readonly outputs: readonly [
				{
					readonly internalType: "bool";
					readonly name: "";
					readonly type: "bool";
				}
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "newOwner";
					readonly type: "address";
				}
			];
			readonly name: "transferOwnership";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		}
	];
	static createInterface(): ERC20MockInterface;
	static connect(address: string, runner?: ContractRunner | null): ERC20Mock;
}
export type GoldTokenConstructorParams = [
	signer?: Signer
] | ConstructorParameters<typeof ContractFactory>;
export declare class GoldToken__factory extends ContractFactory {
	constructor(...args: GoldTokenConstructorParams);
	getDeployTransaction(overrides?: NonPayableOverrides & {
		from?: string;
	}): Promise<ContractDeployTransaction>;
	deploy(overrides?: NonPayableOverrides & {
		from?: string;
	}): Promise<GoldToken & {
		deploymentTransaction(): ContractTransactionResponse;
	}>;
	connect(runner: ContractRunner | null): GoldToken__factory;
	static readonly bytecode = "0x61016060405234801561001157600080fd5b50336040518060400160405280601281526020017120b937bbb0b7309023b7b632102a37b5b2b760711b81525080604051806040016040528060018152602001603160f81b8152506040518060400160405280601281526020017120b937bbb0b7309023b7b632102a37b5b2b760711b815250604051806040016040528060038152602001621051d560ea1b81525081600390816100af91906103bc565b5060046100bc82826103bc565b506100cc915083905060056101ef565b610120526100db8160066101ef565b61014052815160208084019190912060e052815190820120610100524660a05261016860e05161010051604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f60208201529081019290925260608201524660808201523060a082015260009060c00160405160208183030381529060405280519060200120905090565b60805250503060c052506001600160a01b0381166101a157604051631e4fbdf760e01b8152600060048201526024015b60405180910390fd5b6101aa81610222565b506101b6600933610274565b506040513381527f16baa937b08d58713325f93ac58b8a9369a4359bbefb4957d6d9b402735722ab9060200160405180910390a16104ec565b600060208351101561020b5761020483610290565b905061021c565b8161021684826103bc565b5060ff90505b92915050565b600880546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b6000610289836001600160a01b0384166102ce565b9392505050565b600080829050601f815111156102bb578260405163305a27a960e01b8152600401610198919061047a565b80516102c6826104c8565b179392505050565b60008181526001830160205260408120546103155750815460018181018455600084815260208082209093018490558454848252828601909352604090209190915561021c565b50600061021c565b634e487b7160e01b600052604160045260246000fd5b600181811c9082168061034757607f821691505b60208210810361036757634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156103b757806000526020600020601f840160051c810160208510156103945750805b601f840160051c820191505b818110156103b457600081556001016103a0565b50505b505050565b81516001600160401b038111156103d5576103d561031d565b6103e9816103e38454610333565b8461036d565b6020601f82116001811461041d57600083156104055750848201515b600019600385901b1c1916600184901b1784556103b4565b600084815260208120601f198516915b8281101561044d578785015182556020948501946001909201910161042d565b508482101561046b5786840151600019600387901b60f8161c191681555b50505050600190811b01905550565b602081526000825180602084015260005b818110156104a8576020818601810151604086840101520161048b565b506000604082850101526040601f19601f83011684010191505092915050565b805160208083015191908110156103675760001960209190910360031b1b16919050565b60805160a05160c05160e0516101005161012051610140516116106105466000396000610bae01526000610b8101526000610a6b01526000610a430152600061099e015260006109c8015260006109f201526116106000f3fe608060405234801561001057600080fd5b506004361061014d5760003560e01c806379cc6790116100c3578063a0712d681161007c578063a0712d68146102b2578063a9059cbb146102c5578063d505accf146102d8578063dd62ed3e146102eb578063f2fde38b14610324578063f97b57ec1461033757600080fd5b806379cc67901461023b5780637ecebe001461024e57806384b0196e146102615780638da5cb5b1461027c57806395d89b4114610297578063983b2d561461029f57600080fd5b8063313ce56711610115578063313ce567146101cd5780633644e515146101dc57806340c10f19146101e457806342966c68146101f757806370a082311461020a578063715018a61461023357600080fd5b806306fdde0314610152578063095ea7b31461017057806318160ddd1461019357806323b872dd146101a55780633092afd5146101b8575b600080fd5b61015a61034c565b60405161016791906112ce565b60405180910390f35b61018361017e3660046112fd565b6103de565b6040519015158152602001610167565b6002545b604051908152602001610167565b6101836101b3366004611327565b6103f8565b6101cb6101c6366004611364565b61041c565b005b60405160128152602001610167565b6101976104bd565b6101cb6101f23660046112fd565b6104cc565b6101cb61020536600461137f565b61051f565b610197610218366004611364565b6001600160a01b031660009081526020819052604090205490565b6101cb61052c565b6101cb6102493660046112fd565b610540565b61019761025c366004611364565b610555565b610269610573565b6040516101679796959493929190611398565b6008546040516001600160a01b039091168152602001610167565b61015a6105b9565b6101cb6102ad366004611364565b6105c8565b6101cb6102c036600461137f565b610660565b6101836102d33660046112fd565b6106ab565b6101cb6102e6366004611430565b6106b9565b6101976102f93660046114a3565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b6101cb610332366004611364565b6107f3565b61033f61082e565b60405161016791906114d6565b60606003805461035b90611522565b80601f016020809104026020016040519081016040528092919081815260200182805461038790611522565b80156103d45780601f106103a9576101008083540402835291602001916103d4565b820191906000526020600020905b8154815290600101906020018083116103b757829003601f168201915b5050505050905090565b6000336103ec81858561083a565b60019150505b92915050565b60003361040685828561084c565b6104118585856108cb565b506001949350505050565b61042461092a565b61042f600982610957565b6104715760405162461bcd60e51b815260206004820152600e60248201526d24a72b20a624a22fa6a4a72a22a960911b60448201526064015b60405180910390fd5b61047c60098261097c565b506040516001600160a01b03821681527f2f91b591fc56ac0917953ad01ec225524ee5ef0555213e4c8a9d8c9728ee7ffb906020015b60405180910390a150565b60006104c7610991565b905090565b6104d9335b600990610957565b6105115760405162461bcd60e51b81526020600482015260096024820152682327a92124a22222a760b91b6044820152606401610468565b61051b8282610abc565b5050565b6105293382610af2565b50565b61053461092a565b61053e6000610b28565b565b61054b82338361084c565b61051b8282610af2565b6001600160a01b0381166000908152600760205260408120546103f2565b600060608060008060006060610587610b7a565b61058f610ba7565b60408051600080825260208201909252600f60f81b9b939a50919850469750309650945092509050565b60606004805461035b90611522565b6105d061092a565b6105db600982610957565b1561061b5760405162461bcd60e51b815260206004820152601060248201526f222aa82624a1a0aa22afa6a4a72a22a960811b6044820152606401610468565b610626600982610bd4565b506040516001600160a01b03821681527f16baa937b08d58713325f93ac58b8a9369a4359bbefb4957d6d9b402735722ab906020016104b2565b610669336104d1565b6106a15760405162461bcd60e51b81526020600482015260096024820152682327a92124a22222a760b91b6044820152606401610468565b6105293382610abc565b6000336103ec8185856108cb565b834211156106dd5760405163313c898160e11b815260048101859052602401610468565b60007f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c988888861072a8c6001600160a01b0316600090815260076020526040902080546001810190915590565b6040805160208101969096526001600160a01b0394851690860152929091166060840152608083015260a082015260c0810186905260e001604051602081830303815290604052805190602001209050600061078582610be9565b9050600061079582878787610c16565b9050896001600160a01b0316816001600160a01b0316146107dc576040516325c0072360e11b81526001600160a01b0380831660048301528b166024820152604401610468565b6107e78a8a8a61083a565b50505050505050505050565b6107fb61092a565b6001600160a01b03811661082557604051631e4fbdf760e01b815260006004820152602401610468565b61052981610b28565b60606104c76009610c44565b6108478383836001610c51565b505050565b6001600160a01b038381166000908152600160209081526040808320938616835292905220546000198110156108c557818110156108b657604051637dc7a0d960e11b81526001600160a01b03841660048201526024810182905260448101839052606401610468565b6108c584848484036000610c51565b50505050565b6001600160a01b0383166108f557604051634b637e8f60e11b815260006004820152602401610468565b6001600160a01b03821661091f5760405163ec442f0560e01b815260006004820152602401610468565b610847838383610d26565b6008546001600160a01b0316331461053e5760405163118cdaa760e01b8152336004820152602401610468565b6001600160a01b038116600090815260018301602052604081205415155b9392505050565b6000610975836001600160a01b038416610e50565b6000306001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161480156109ea57507f000000000000000000000000000000000000000000000000000000000000000046145b15610a1457507f000000000000000000000000000000000000000000000000000000000000000090565b6104c7604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f60208201527f0000000000000000000000000000000000000000000000000000000000000000918101919091527f000000000000000000000000000000000000000000000000000000000000000060608201524660808201523060a082015260009060c00160405160208183030381529060405280519060200120905090565b6001600160a01b038216610ae65760405163ec442f0560e01b815260006004820152602401610468565b61051b60008383610d26565b6001600160a01b038216610b1c57604051634b637e8f60e11b815260006004820152602401610468565b61051b82600083610d26565b600880546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b60606104c77f00000000000000000000000000000000000000000000000000000000000000006005610f43565b60606104c77f00000000000000000000000000000000000000000000000000000000000000006006610f43565b6000610975836001600160a01b038416610fee565b60006103f2610bf6610991565b8360405161190160f01b8152600281019290925260228201526042902090565b600080600080610c288888888861103d565b925092509250610c38828261110c565b50909695505050505050565b60606000610975836111c5565b6001600160a01b038416610c7b5760405163e602df0560e01b815260006004820152602401610468565b6001600160a01b038316610ca557604051634a1406b160e11b815260006004820152602401610468565b6001600160a01b03808516600090815260016020908152604080832093871683529290522082905580156108c557826001600160a01b0316846001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92584604051610d1891815260200190565b60405180910390a350505050565b6001600160a01b038316610d51578060026000828254610d469190611572565b90915550610dc39050565b6001600160a01b03831660009081526020819052604090205481811015610da45760405163391434e360e21b81526001600160a01b03851660048201526024810182905260448101839052606401610468565b6001600160a01b03841660009081526020819052604090209082900390555b6001600160a01b038216610ddf57600280548290039055610dfe565b6001600160a01b03821660009081526020819052604090208054820190555b816001600160a01b0316836001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051610e4391815260200190565b60405180910390a3505050565b60008181526001830160205260408120548015610f39576000610e74600183611585565b8554909150600090610e8890600190611585565b9050808214610eed576000866000018281548110610ea857610ea8611598565b9060005260206000200154905080876000018481548110610ecb57610ecb611598565b6000918252602080832090910192909255918252600188019052604090208390555b8554869080610efe57610efe6115ae565b6001900381819060005260206000200160009055905585600101600086815260200190815260200160002060009055600193505050506103f2565b60009150506103f2565b606060ff8314610f5d57610f5683611221565b90506103f2565b818054610f6990611522565b80601f0160208091040260200160405190810160405280929190818152602001828054610f9590611522565b8015610fe25780601f10610fb757610100808354040283529160200191610fe2565b820191906000526020600020905b815481529060010190602001808311610fc557829003601f168201915b505050505090506103f2565b6000818152600183016020526040812054611035575081546001818101845560008481526020808220909301849055845484825282860190935260409020919091556103f2565b5060006103f2565b600080807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08411156110785750600091506003905082611102565b604080516000808252602082018084528a905260ff891692820192909252606081018790526080810186905260019060a0016020604051602081039080840390855afa1580156110cc573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b0381166110f857506000925060019150829050611102565b9250600091508190505b9450945094915050565b6000826003811115611120576111206115c4565b03611129575050565b600182600381111561113d5761113d6115c4565b0361115b5760405163f645eedf60e01b815260040160405180910390fd5b600282600381111561116f5761116f6115c4565b036111905760405163fce698f760e01b815260048101829052602401610468565b60038260038111156111a4576111a46115c4565b0361051b576040516335e2f38360e21b815260048101829052602401610468565b60608160000180548060200260200160405190810160405280929190818152602001828054801561121557602002820191906000526020600020905b815481526020019060010190808311611201575b50505050509050919050565b6060600061122e83611260565b604080516020808252818301909252919250600091906020820181803683375050509182525060208101929092525090565b600060ff8216601f8111156103f257604051632cd44ac360e21b815260040160405180910390fd5b6000815180845260005b818110156112ae57602081850181015186830182015201611292565b506000602082860101526020601f19601f83011685010191505092915050565b6020815260006109756020830184611288565b80356001600160a01b03811681146112f857600080fd5b919050565b6000806040838503121561131057600080fd5b611319836112e1565b946020939093013593505050565b60008060006060848603121561133c57600080fd5b611345846112e1565b9250611353602085016112e1565b929592945050506040919091013590565b60006020828403121561137657600080fd5b610975826112e1565b60006020828403121561139157600080fd5b5035919050565b60ff60f81b8816815260e0602082015260006113b760e0830189611288565b82810360408401526113c98189611288565b606084018890526001600160a01b038716608085015260a0840186905283810360c08501528451808252602080870193509091019060005b8181101561141f578351835260209384019390920191600101611401565b50909b9a5050505050505050505050565b600080600080600080600060e0888a03121561144b57600080fd5b611454886112e1565b9650611462602089016112e1565b95506040880135945060608801359350608088013560ff8116811461148657600080fd5b9699959850939692959460a0840135945060c09093013592915050565b600080604083850312156114b657600080fd5b6114bf836112e1565b91506114cd602084016112e1565b90509250929050565b602080825282518282018190526000918401906040840190835b818110156115175783516001600160a01b03168352602093840193909201916001016114f0565b509095945050505050565b600181811c9082168061153657607f821691505b60208210810361155657634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b808201808211156103f2576103f261155c565b818103818111156103f2576103f261155c565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052603160045260246000fd5b634e487b7160e01b600052602160045260246000fdfea264697066735822122053a796be8af4f0a2b17ded86a673dd3950fb3c304728368f006a7e968b0f134c64736f6c634300081e0033";
	static readonly abi: readonly [
		{
			readonly inputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "constructor";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "ECDSAInvalidSignature";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "length";
					readonly type: "uint256";
				}
			];
			readonly name: "ECDSAInvalidSignatureLength";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "bytes32";
					readonly name: "s";
					readonly type: "bytes32";
				}
			];
			readonly name: "ECDSAInvalidSignatureS";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "spender";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "allowance";
					readonly type: "uint256";
				},
				{
					readonly internalType: "uint256";
					readonly name: "needed";
					readonly type: "uint256";
				}
			];
			readonly name: "ERC20InsufficientAllowance";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "sender";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "balance";
					readonly type: "uint256";
				},
				{
					readonly internalType: "uint256";
					readonly name: "needed";
					readonly type: "uint256";
				}
			];
			readonly name: "ERC20InsufficientBalance";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "approver";
					readonly type: "address";
				}
			];
			readonly name: "ERC20InvalidApprover";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "receiver";
					readonly type: "address";
				}
			];
			readonly name: "ERC20InvalidReceiver";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "sender";
					readonly type: "address";
				}
			];
			readonly name: "ERC20InvalidSender";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "spender";
					readonly type: "address";
				}
			];
			readonly name: "ERC20InvalidSpender";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "deadline";
					readonly type: "uint256";
				}
			];
			readonly name: "ERC2612ExpiredSignature";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "signer";
					readonly type: "address";
				},
				{
					readonly internalType: "address";
					readonly name: "owner";
					readonly type: "address";
				}
			];
			readonly name: "ERC2612InvalidSigner";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "account";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "currentNonce";
					readonly type: "uint256";
				}
			];
			readonly name: "InvalidAccountNonce";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "InvalidShortString";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "owner";
					readonly type: "address";
				}
			];
			readonly name: "OwnableInvalidOwner";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "account";
					readonly type: "address";
				}
			];
			readonly name: "OwnableUnauthorizedAccount";
			readonly type: "error";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "string";
					readonly name: "str";
					readonly type: "string";
				}
			];
			readonly name: "StringTooLong";
			readonly type: "error";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: false;
					readonly internalType: "address";
					readonly name: "newMinter";
					readonly type: "address";
				}
			];
			readonly name: "AddMinter";
			readonly type: "event";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "owner";
					readonly type: "address";
				},
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "spender";
					readonly type: "address";
				},
				{
					readonly indexed: false;
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "Approval";
			readonly type: "event";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
			];
			readonly name: "EIP712DomainChanged";
			readonly type: "event";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "previousOwner";
					readonly type: "address";
				},
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "newOwner";
					readonly type: "address";
				}
			];
			readonly name: "OwnershipTransferred";
			readonly type: "event";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: false;
					readonly internalType: "address";
					readonly name: "oldMinter";
					readonly type: "address";
				}
			];
			readonly name: "RemoveMinter";
			readonly type: "event";
		},
		{
			readonly anonymous: false;
			readonly inputs: readonly [
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "from";
					readonly type: "address";
				},
				{
					readonly indexed: true;
					readonly internalType: "address";
					readonly name: "to";
					readonly type: "address";
				},
				{
					readonly indexed: false;
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "Transfer";
			readonly type: "event";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "DOMAIN_SEPARATOR";
			readonly outputs: readonly [
				{
					readonly internalType: "bytes32";
					readonly name: "";
					readonly type: "bytes32";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "_minter";
					readonly type: "address";
				}
			];
			readonly name: "addMinter";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "owner";
					readonly type: "address";
				},
				{
					readonly internalType: "address";
					readonly name: "spender";
					readonly type: "address";
				}
			];
			readonly name: "allowance";
			readonly outputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "spender";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "approve";
			readonly outputs: readonly [
				{
					readonly internalType: "bool";
					readonly name: "";
					readonly type: "bool";
				}
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "account";
					readonly type: "address";
				}
			];
			readonly name: "balanceOf";
			readonly outputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "burn";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "account";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "burnFrom";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "decimals";
			readonly outputs: readonly [
				{
					readonly internalType: "uint8";
					readonly name: "";
					readonly type: "uint8";
				}
			];
			readonly stateMutability: "pure";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "eip712Domain";
			readonly outputs: readonly [
				{
					readonly internalType: "bytes1";
					readonly name: "fields";
					readonly type: "bytes1";
				},
				{
					readonly internalType: "string";
					readonly name: "name";
					readonly type: "string";
				},
				{
					readonly internalType: "string";
					readonly name: "version";
					readonly type: "string";
				},
				{
					readonly internalType: "uint256";
					readonly name: "chainId";
					readonly type: "uint256";
				},
				{
					readonly internalType: "address";
					readonly name: "verifyingContract";
					readonly type: "address";
				},
				{
					readonly internalType: "bytes32";
					readonly name: "salt";
					readonly type: "bytes32";
				},
				{
					readonly internalType: "uint256[]";
					readonly name: "extensions";
					readonly type: "uint256[]";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "to";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "amount";
					readonly type: "uint256";
				}
			];
			readonly name: "mint";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "amount";
					readonly type: "uint256";
				}
			];
			readonly name: "mint";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "minters";
			readonly outputs: readonly [
				{
					readonly internalType: "address[]";
					readonly name: "";
					readonly type: "address[]";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "name";
			readonly outputs: readonly [
				{
					readonly internalType: "string";
					readonly name: "";
					readonly type: "string";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "owner";
					readonly type: "address";
				}
			];
			readonly name: "nonces";
			readonly outputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "owner";
			readonly outputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "";
					readonly type: "address";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "owner";
					readonly type: "address";
				},
				{
					readonly internalType: "address";
					readonly name: "spender";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				},
				{
					readonly internalType: "uint256";
					readonly name: "deadline";
					readonly type: "uint256";
				},
				{
					readonly internalType: "uint8";
					readonly name: "v";
					readonly type: "uint8";
				},
				{
					readonly internalType: "bytes32";
					readonly name: "r";
					readonly type: "bytes32";
				},
				{
					readonly internalType: "bytes32";
					readonly name: "s";
					readonly type: "bytes32";
				}
			];
			readonly name: "permit";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "_minter";
					readonly type: "address";
				}
			];
			readonly name: "removeMinter";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "renounceOwnership";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "symbol";
			readonly outputs: readonly [
				{
					readonly internalType: "string";
					readonly name: "";
					readonly type: "string";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
			];
			readonly name: "totalSupply";
			readonly outputs: readonly [
				{
					readonly internalType: "uint256";
					readonly name: "";
					readonly type: "uint256";
				}
			];
			readonly stateMutability: "view";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "to";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "transfer";
			readonly outputs: readonly [
				{
					readonly internalType: "bool";
					readonly name: "";
					readonly type: "bool";
				}
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "from";
					readonly type: "address";
				},
				{
					readonly internalType: "address";
					readonly name: "to";
					readonly type: "address";
				},
				{
					readonly internalType: "uint256";
					readonly name: "value";
					readonly type: "uint256";
				}
			];
			readonly name: "transferFrom";
			readonly outputs: readonly [
				{
					readonly internalType: "bool";
					readonly name: "";
					readonly type: "bool";
				}
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		},
		{
			readonly inputs: readonly [
				{
					readonly internalType: "address";
					readonly name: "newOwner";
					readonly type: "address";
				}
			];
			readonly name: "transferOwnership";
			readonly outputs: readonly [
			];
			readonly stateMutability: "nonpayable";
			readonly type: "function";
		}
	];
	static createInterface(): GoldTokenInterface;
	static connect(address: string, runner?: ContractRunner | null): GoldToken;
}
export type Runner = SignerWithAddress | Provider;
export interface BaseConfig extends Record<string, string | number> {
	chainId: number;
	rpc: string;
}
export interface GoldConfig extends BaseConfig {
	goldToken: string;
	goldPriceFeed: string;
	goldReserveFeed: string;
	goldMinter: string;
}
export declare enum Networks {
	MAINNET = 1,
	ARBITRUM_SEPOLIA = 421614
}
export declare const goldConfigs: Record<number, GoldConfig>;
export declare function getStableCoinContract(address: string, runner?: Runner): ERC20Mock;
export declare function getGoldTokenContract(address: string, runner?: Runner): GoldToken;
export declare function getGoldPriceFeedContract(address: string, runner?: Runner): DataFeed;
export declare function getGoldReserveFeedContract(address: string, runner?: Runner): DataFeed;
export declare function getGoldMinterContract(address: string, runner?: Runner): GoldMinter;
export declare const DATAFEED_DECIMALS = 8;
export declare const GOLD_TOKEN_DECIMALS = 18;
export declare const USD_TOKEN_MAX_DECIMALS = 6;
export declare enum Levels {
	DEFAULT = 0,
	KYCD = 1,
	APPROVED = 2
}
export interface GoldStats {
	goldSupply: number;
	goldPrice: number;
	goldReserve: number;
	slippage: number;
	fees: number;
	tradeLevel: Levels;
	minGoldAmount: number;
	minGoldFee: number;
	minGoldFeeAmount: number;
}
export interface GoldMintQuote {
	inputAmount: number;
	isBuy: boolean;
	goldPrice: number;
	fees?: number;
	slippage?: number;
	minGoldFee?: number;
	minGoldFeeAmount?: number;
}
export interface GoldMintQuoteResult {
	outputAmount: number;
	outputOnSlippage: number;
	goldAmount: number;
	goldFees: number;
}
export declare function getGoldStats({ goldToken, goldPriceFeed, goldReserveFeed, goldMinter, }: {
	goldToken: GoldToken;
	goldPriceFeed: DataFeed;
	goldReserveFeed: DataFeed;
	goldMinter: GoldMinter;
}): Promise<GoldStats>;
export declare function calculateSwap({ inputAmount, isBuy, goldPrice, fees, slippage, minGoldFee, minGoldFeeAmount, }: GoldMintQuote): GoldMintQuoteResult;
export declare function NumDecimals(num: number | string | bigint, maxDecimals?: number): number;

declare namespace ownableSol {
	export { Ownable };
}
declare namespace utils {
	export { addressSol, cryptography, errorsSol, introspection, math, noncesSol, shortStringsSol, stringsSol };
}
declare namespace draftIerc6093Sol {
	export { IERC1155Errors, IERC20Errors, IERC721Errors };
}
declare namespace ierc1363Sol {
	export { IERC1363 };
}
declare namespace ierc1967Sol {
	export { IERC1967 };
}
declare namespace ierc5267Sol {
	export { IERC5267 };
}
declare namespace erc1967UtilsSol {
	export { ERC1967Utils };
}
declare namespace beacon {
	export { iBeaconSol };
}
declare namespace iBeaconSol {
	export { IBeacon };
}
declare namespace erc1967 {
	export { erc1967UtilsSol };
}
declare namespace proxySol {
	export { Proxy$1 as Proxy };
}
declare namespace ierc20PermitSol {
	export { IERC20Permit };
}
declare namespace erc20BurnableSol {
	export { ERC20Burnable };
}
declare namespace erc20PermitSol {
	export { ERC20Permit };
}
declare namespace ierc20MetadataSol {
	export { IERC20Metadata };
}
declare namespace utils$1 {
	export { safeErc20Sol };
}
declare namespace safeErc20Sol {
	export { SafeERC20 };
}
declare namespace erc20Sol {
	export { ERC20 };
}
declare namespace ierc20Sol {
	export { IERC20 };
}
declare namespace extensions {
	export { erc20BurnableSol, erc20PermitSol, ierc20MetadataSol, ierc20PermitSol };
}
declare namespace erc20 {
	export { erc20Sol, extensions, ierc20Sol, utils$1 as utils };
}
declare namespace eip712Sol {
	export { EIP712 };
}
declare namespace ecdsaSol {
	export { ECDSA };
}
declare namespace math {
	export { safeCastSol };
}
declare namespace ierc165Sol {
	export { IERC165 };
}
declare namespace safeCastSol {
	export { SafeCast };
}
declare namespace addressSol {
	export { Address };
}
declare namespace errorsSol {
	export { Errors };
}
declare namespace noncesSol {
	export { Nonces };
}
declare namespace shortStringsSol {
	export { ShortStrings };
}
declare namespace stringsSol {
	export { Strings };
}
declare namespace cryptography {
	export { ecdsaSol, eip712Sol };
}
declare namespace introspection {
	export { ierc165Sol };
}
declare namespace access {
	export { ownableSol };
}
declare namespace interfaces {
	export { draftIerc6093Sol, ierc1363Sol, ierc1967Sol, ierc5267Sol };
}
declare namespace proxy {
	export { beacon, erc1967, proxySol };
}
declare namespace token {
	export { erc20 };
}
declare namespace contractsUpgradeable {
	export { access$1 as access, proxy$1 as proxy, utils$2 as utils };
}
declare namespace ownableUpgradeableSol {
	export { OwnableUpgradeable };
}
declare namespace utils$2 {
	export { contextUpgradeableSol, reentrancyGuardUpgradeableSol };
}
declare namespace initializableSol {
	export { Initializable };
}
declare namespace utils$3 {
	export { initializableSol };
}
declare namespace reentrancyGuardUpgradeableSol {
	export { ReentrancyGuardUpgradeable };
}
declare namespace contextUpgradeableSol {
	export { ContextUpgradeable };
}
declare namespace access$1 {
	export { ownableUpgradeableSol };
}
declare namespace proxy$1 {
	export { utils$3 as utils };
}
declare namespace contracts {
	export { access, interfaces, proxy, token, utils };
}
declare namespace factories {
	export { contracts$2 as contracts, openzeppelin };
}
declare namespace iPriceFeedSol {
	export { IPriceFeed };
}
declare namespace ierc20Sol$1 {
	export { IERC20Exp, IERC20Mintable };
}
declare namespace iInitializableProxySol {
	export { IInitializableProxy };
}
declare namespace tokens {
	export { erc20MockSol, goldTokenSol };
}
declare namespace withSettlerSol {
	export { WithSettler };
}
declare namespace sigLibSol {
	export { SigLib };
}
declare namespace dataFeedSol {
	export { DataFeed };
}
declare namespace initializableProxySol {
	export { InitializableProxy };
}
declare namespace goldTokenSol {
	export { GoldToken };
}
declare namespace erc20MockSol {
	export { ERC20Mock };
}
declare namespace goldMinterSol {
	export { GoldMinter };
}
declare namespace lockSol {
	export { Lock$1 as Lock };
}
declare namespace interfaces$1 {
	export { iInitializableProxySol, iPriceFeedSol, ierc20Sol$1 as ierc20Sol };
}
declare namespace libraries {
	export { sigLibSol, withSettlerSol };
}
declare namespace oracle {
	export { dataFeedSol };
}
declare namespace proxy$2 {
	export { initializableProxySol };
}
declare namespace ownableSol$1 {
	export { Ownable__factory };
}
declare namespace utils$4 {
	export { addressSol$1 as addressSol, cryptography$1 as cryptography, errorsSol$1 as errorsSol, introspection$1 as introspection, math$1 as math, noncesSol$1 as noncesSol, shortStringsSol$1 as shortStringsSol, stringsSol$1 as stringsSol };
}
declare namespace draftIerc6093Sol$1 {
	export { IERC1155Errors__factory, IERC20Errors__factory, IERC721Errors__factory };
}
declare namespace ierc1363Sol$1 {
	export { IERC1363__factory };
}
declare namespace ierc1967Sol$1 {
	export { IERC1967__factory };
}
declare namespace ierc5267Sol$1 {
	export { IERC5267__factory };
}
declare namespace erc1967UtilsSol$1 {
	export { ERC1967Utils__factory };
}
declare namespace beacon$1 {
	export { iBeaconSol$1 as iBeaconSol };
}
declare namespace iBeaconSol$1 {
	export { IBeacon__factory };
}
declare namespace erc1967$1 {
	export { erc1967UtilsSol$1 as erc1967UtilsSol };
}
declare namespace proxySol$1 {
	export { Proxy__factory };
}
declare namespace ierc20PermitSol$1 {
	export { IERC20Permit__factory };
}
declare namespace erc20BurnableSol$1 {
	export { ERC20Burnable__factory };
}
declare namespace erc20PermitSol$1 {
	export { ERC20Permit__factory };
}
declare namespace ierc20MetadataSol$1 {
	export { IERC20Metadata__factory };
}
declare namespace utils$5 {
	export { safeErc20Sol$1 as safeErc20Sol };
}
declare namespace safeErc20Sol$1 {
	export { SafeERC20__factory };
}
declare namespace erc20Sol$1 {
	export { ERC20__factory };
}
declare namespace ierc20Sol$2 {
	export { IERC20__factory };
}
declare namespace extensions$1 {
	export { erc20BurnableSol$1 as erc20BurnableSol, erc20PermitSol$1 as erc20PermitSol, ierc20MetadataSol$1 as ierc20MetadataSol, ierc20PermitSol$1 as ierc20PermitSol };
}
declare namespace erc20$1 {
	export { erc20Sol$1 as erc20Sol, extensions$1 as extensions, ierc20Sol$2 as ierc20Sol, utils$5 as utils };
}
declare namespace eip712Sol$1 {
	export { EIP712__factory };
}
declare namespace ecdsaSol$1 {
	export { ECDSA__factory };
}
declare namespace math$1 {
	export { safeCastSol$1 as safeCastSol };
}
declare namespace ierc165Sol$1 {
	export { IERC165__factory };
}
declare namespace safeCastSol$1 {
	export { SafeCast__factory };
}
declare namespace addressSol$1 {
	export { Address__factory };
}
declare namespace errorsSol$1 {
	export { Errors__factory };
}
declare namespace noncesSol$1 {
	export { Nonces__factory };
}
declare namespace shortStringsSol$1 {
	export { ShortStrings__factory };
}
declare namespace stringsSol$1 {
	export { Strings__factory };
}
declare namespace cryptography$1 {
	export { ecdsaSol$1 as ecdsaSol, eip712Sol$1 as eip712Sol };
}
declare namespace introspection$1 {
	export { ierc165Sol$1 as ierc165Sol };
}
declare namespace access$2 {
	export { ownableSol$1 as ownableSol };
}
declare namespace interfaces$2 {
	export { draftIerc6093Sol$1 as draftIerc6093Sol, ierc1363Sol$1 as ierc1363Sol, ierc1967Sol$1 as ierc1967Sol, ierc5267Sol$1 as ierc5267Sol };
}
declare namespace proxy$3 {
	export { beacon$1 as beacon, erc1967$1 as erc1967, proxySol$1 as proxySol };
}
declare namespace token$1 {
	export { erc20$1 as erc20 };
}
declare namespace contractsUpgradeable$1 {
	export { access$3 as access, proxy$4 as proxy, utils$6 as utils };
}
declare namespace ownableUpgradeableSol$1 {
	export { OwnableUpgradeable__factory };
}
declare namespace utils$6 {
	export { contextUpgradeableSol$1 as contextUpgradeableSol, reentrancyGuardUpgradeableSol$1 as reentrancyGuardUpgradeableSol };
}
declare namespace initializableSol$1 {
	export { Initializable__factory };
}
declare namespace utils$7 {
	export { initializableSol$1 as initializableSol };
}
declare namespace reentrancyGuardUpgradeableSol$1 {
	export { ReentrancyGuardUpgradeable__factory };
}
declare namespace contextUpgradeableSol$1 {
	export { ContextUpgradeable__factory };
}
declare namespace access$3 {
	export { ownableUpgradeableSol$1 as ownableUpgradeableSol };
}
declare namespace proxy$4 {
	export { utils$7 as utils };
}
declare namespace contracts$1 {
	export { access$2 as access, interfaces$2 as interfaces, proxy$3 as proxy, token$1 as token, utils$4 as utils };
}
declare namespace contracts$2 {
	export { goldMinterSol$1 as goldMinterSol, interfaces$3 as interfaces, libraries$1 as libraries, lockSol$1 as lockSol, oracle$1 as oracle, proxy$5 as proxy, tokens$1 as tokens };
}
declare namespace iPriceFeedSol$1 {
	export { IPriceFeed__factory };
}
declare namespace ierc20Sol$3 {
	export { IERC20Exp__factory, IERC20Mintable__factory };
}
declare namespace iInitializableProxySol$1 {
	export { IInitializableProxy__factory };
}
declare namespace tokens$1 {
	export { erc20MockSol$1 as erc20MockSol, goldTokenSol$1 as goldTokenSol };
}
declare namespace withSettlerSol$1 {
	export { WithSettler__factory };
}
declare namespace sigLibSol$1 {
	export { SigLib__factory };
}
declare namespace dataFeedSol$1 {
	export { DataFeed__factory };
}
declare namespace initializableProxySol$1 {
	export { InitializableProxy__factory };
}
declare namespace goldTokenSol$1 {
	export { GoldToken__factory };
}
declare namespace erc20MockSol$1 {
	export { ERC20Mock__factory };
}
declare namespace goldMinterSol$1 {
	export { GoldMinter__factory };
}
declare namespace lockSol$1 {
	export { Lock__factory };
}
declare namespace interfaces$3 {
	export { iInitializableProxySol$1 as iInitializableProxySol, iPriceFeedSol$1 as iPriceFeedSol, ierc20Sol$3 as ierc20Sol };
}
declare namespace libraries$1 {
	export { sigLibSol$1 as sigLibSol, withSettlerSol$1 as withSettlerSol };
}
declare namespace oracle$1 {
	export { dataFeedSol$1 as dataFeedSol };
}
declare namespace proxy$5 {
	export { initializableProxySol$1 as initializableProxySol };
}
declare namespace openzeppelin {
	export { contracts$1 as contracts, contractsUpgradeable$1 as contractsUpgradeable };
}
declare namespace openzeppelin$1 {
	export { contracts, contractsUpgradeable };
}
declare namespace contracts$3 {
	export { goldMinterSol, interfaces$1 as interfaces, libraries, lockSol, oracle, proxy$2 as proxy, tokens };
}

export {
	Lock$1 as Lock,
	Proxy$1 as Proxy,
	contracts$3 as contracts,
	factories,
	openzeppelin$1 as openzeppelin,
};

export {};
