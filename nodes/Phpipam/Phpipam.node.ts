import { IExecuteFunctions } from 'n8n-core';

import {
	ICredentialsDecrypted,
	ICredentialTestFunctions,
	IDataObject,
	INodeCredentialTestResult,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	LoggerProxy,
	NodeApiError,
} from 'n8n-workflow';

import { phpipamApiRequest, simplify } from './GenericFunctions';

import { version } from '../version';
import {
	addressesFields,
	addressesOperations,
	sectionsFields,
	sectionsOperations,
	subnetsFields,
} from './descriptions';
import { OptionsWithUri } from 'request-promise-native';
import { subnetsOperations } from './descriptions/SubnetsDescription';

export class Phpipam implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Phpipam',
		name: 'Phpipam',
		icon: 'file:phpipam.png',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: `Consume Phpipam API (v.${version})`,
		defaults: {
			name: 'phpipam',
			color: '#FF6000',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'phpipamApi',
				required: true,
				testedBy: 'testPhpipamApiAuth',
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{
						name: 'Sections',
						value: 'sections',
					},
					{
						name: 'Subnets',
						value: 'subnets',
					},
					{
						name: 'Addresses',
						value: 'addresses',
					},
				],
				default: 'sections',
				required: true,
				description: 'Resource to consume',
			},
			...sectionsOperations,
			...sectionsFields,
			...subnetsOperations,
			...subnetsFields,
			...addressesOperations,
			...addressesFields,
		],
	};

	methods = {
		credentialTest: {
			async testPhpipamApiAuth(
				this: ICredentialTestFunctions,
				credential: ICredentialsDecrypted,
			): Promise<INodeCredentialTestResult> {
				if (
					!credential.data?.url ||
					!credential.data?.app_id ||
					!credential.data?.user ||
					!credential.data?.password
				) {
					return {
						status: 'Error',
						message: `Data are missing`,
					};
				}

				const options: OptionsWithUri = {
					method: 'POST',
					headers: {
						Authorization: `Basic ${Buffer.from(
							`${credential.data.user}:${credential.data.password}`,
						).toString('base64')}`,
					},
					qs: {},
					uri: `${credential.data.url}/api/${credential.data.app_id}/user` as string,
					timeout: 5000,
					json: true,
				};
				try {
					const response = await this.helpers.request(options);

					if (response?.success === true) {
						return {
							status: 'OK',
							message: 'Connection successful!',
						};
					}

					if (response?.success === false) {
						return {
							status: 'Error',
							message: response.errors?.reason,
						};
					}

					return {
						status: 'Error',
						message: `Invalid Url`,
					};
				} catch (err: any) {
					return {
						status: 'Error',
						message: err.message,
					};
				}
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		let responseData;
		const returnData: IDataObject[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		const body: IDataObject = {};
		let method = '';
		let endpoint = '';
		const qs: IDataObject = {};

		for (let i = 0; i < items.length; i++) {
			try {
				switch (resource) {
					case 'sections':
						switch (operation) {
							case 'list':
								// ----------------------------------
								//        sections:list
								// ----------------------------------
								endpoint = '/sections';
								method = 'GET';
								break;

							case 'getSectionsSubnets':
								// ----------------------------------
								//        sections:getSectionsSubnets
								// ----------------------------------
								endpoint = `/sections/${
									this.getNodeParameter('section_id', i) as string
								}/subnets/addresses`;
								method = 'GET';
								break;

							default:
								break;
						}
						break;

					case 'subnets':
						switch (operation) {
							case 'list':
								// ----------------------------------
								//        subnets:list
								// ----------------------------------
								endpoint = '/subnets';
								method = 'GET';
								break;

							case 'listAll':
								// ----------------------------------
								//        subnets:listAll
								// ----------------------------------
								endpoint = '/subnets/all';
								method = 'GET';
								break;

							default:
								break;
						}
						break;

					case 'addresses':
						switch (operation) {
							case 'get':
								// ----------------------------------
								//        addresses:get
								// ----------------------------------
								endpoint = `/addresses/${
									this.getNodeParameter('address_id', i) as string
								}`;
								method = 'GET';
								break;

							case 'listAll':
								// ----------------------------------
								//        addresses:listAll
								// ----------------------------------
								endpoint = '/addresses/all';
								method = 'GET';
								break;

							case 'ping':
								// ----------------------------------
								//        addresses:ping
								// ----------------------------------
								endpoint = `/addresses/${
									this.getNodeParameter('address_id', i) as string
								}/ping`;
								method = 'GET';
								break;

							default:
								break;
						}
						break;

					default:
						break;
				}

				responseData = await phpipamApiRequest.call(
					this,
					method,
					endpoint,
					body,
					qs,
				);

				if (!responseData || Object.keys(responseData).length === 0) {
					responseData = { success: true };
				}

				if (!responseData.success) {
					throw new NodeApiError(this.getNode(), responseData);
				}

				if (responseData.data) responseData = responseData.data;

				if (Array.isArray(responseData)) {
					returnData.push.apply(returnData, responseData as IDataObject[]);
				} else if (responseData !== undefined && responseData !== null) {
					returnData.push(responseData as IDataObject);
				} else {
					returnData.push({} as IDataObject);
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ error: error.message });
					continue;
				}
				throw error;
			}
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
