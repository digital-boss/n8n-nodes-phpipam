import { INodeProperties } from 'n8n-workflow';

export const subnetsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['subnets'],
			},
		},
		options: [
			{
				name: 'List Subnets',
				value: 'list',
				description: 'Returns all subnets in all sections',
			},
			{
				name: 'List All Subnets',
				value: 'listAll',
				description: 'Returns all subnets in all sections (alias)',
			},
		],
		default: 'list',
		description: 'The operation to perform',
	},
];

export const sectionsFields: INodeProperties[] = [
	/*-------------------------------------------------------------------------- */
	/*                                subnets:list                               */
	/* ------------------------------------------------------------------------- */
	/*-------------------------------------------------------------------------- */
	/*                                subnets:listAll                            */
	/* ------------------------------------------------------------------------- */
];
