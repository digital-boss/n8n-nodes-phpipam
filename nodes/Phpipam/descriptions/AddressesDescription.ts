import { INodeProperties } from 'n8n-workflow';

export const addressesOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['addresses'],
			},
		},
		options: [
			{
				name: 'List All Addresses',
				value: 'listAll',
				description: 'Returns all addresses in all sections',
			},
			{
				name: 'Get Specific Address',
				value: 'get',
				description: 'Returns specific address',
			},
			{
				name: 'Ping Address',
				value: 'ping',
				description: 'Checks address status',
			},
		],
		default: 'listAll',
		description: 'The operation to perform',
	},
];

export const addressesFields: INodeProperties[] = [
	/*-------------------------------------------------------------------------- */
	/*                                addresses:get                              */
	/* ------------------------------------------------------------------------- */
	{
		displayName: 'Address Id',
		name: 'address_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['addresses'],
				operation: ['get'],
			},
		},
		default: '',
	},
	/*-------------------------------------------------------------------------- */
	/*                                addresses:listAll                          */
	/* ------------------------------------------------------------------------- */
	/*-------------------------------------------------------------------------- */
	/*                                addresses:ping                             */
	/* ------------------------------------------------------------------------- */
	{
		displayName: 'Address Id',
		name: 'address_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['addresses'],
				operation: ['ping'],
			},
		},
		default: '',
	},
];
