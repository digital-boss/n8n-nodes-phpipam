import { OptionsWithUri } from 'request';

import {
	IExecuteFunctions,
	IExecuteSingleFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
} from 'n8n-core';

import { IDataObject, NodeApiError, NodeOperationError } from 'n8n-workflow';

export async function phpipamApiRequest(
	this:
		| IHookFunctions
		| IExecuteFunctions
		| IExecuteSingleFunctions
		| ILoadOptionsFunctions,
	method: string,
	endpoint: string,
	body: object = {},
	qs: object = {},
	uri?: string,
): Promise<any> {
	// tslint:disable-line:no-any

	//Get credentials the user provided for this node
	const credentials = (await this.getCredentials('phpipamApi')) as IDataObject;

	if (credentials === undefined) {
		throw new NodeOperationError(
			this.getNode(),
			'No credentials got returned!',
		);
	}

	const {
		data: { token },
	} = await this.helpers.request!({
		method: 'POST',
		headers: {
			Authorization: `Basic ${Buffer.from(
				`${credentials.user}:${credentials.password}`,
			).toString('base64')}`,
		},
		qs: {},
		uri: `${credentials.url}/api/${credentials.app_id}/user` as string,
		timeout: 5000,
		json: true,
	});

	if (!token) {
		throw new NodeApiError(this.getNode(), { message: 'Access Denied' });
	}

	//Make http request according to <https://sendgrid.com/docs/api-reference/>
	const options: OptionsWithUri = {
		method,
		headers: {
			token,
		},
		qs,
		body,
		uri: `${credentials.url}/api/${credentials.app_id}${endpoint}` as string,
		json: true,
	};

	if (Object.keys(options.qs).length === 0) {
		delete options.qs;
	}
	if (Object.keys(options.body).length === 0) {
		delete options.body;
	}

	try {
		return this.helpers.request!(options);
	} catch (error) {
		console.log('error', error);
		throw new NodeApiError(this.getNode(), error);
	}
}

export function simplify(jsonData: IDataObject): IDataObject[] {
	return (jsonData['data'] as IDataObject[]) || jsonData;
}
