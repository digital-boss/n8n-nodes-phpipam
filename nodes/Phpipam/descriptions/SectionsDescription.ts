import { INodeProperties } from 'n8n-workflow';

export const sectionsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['sections'],
			},
		},
		options: [
			{
				name: 'List Sections',
				value: 'list',
				description: 'Returns all sections',
			},
			{
				name: 'Get Section\'s Subnets',
				value: 'getSectionsSubnets',
				description: 'Returns all subnets in section',
			},
		],
		default: 'list',
		description: 'The operation to perform',
	},
];

export const subnetsFields: INodeProperties[] = [
	/*-------------------------------------------------------------------------- */
	/*                                sections:list                              */
	/* ------------------------------------------------------------------------- */
	/*-------------------------------------------------------------------------- */
	/*                                sections:getSectionsSubnets                */
	/* ------------------------------------------------------------------------- */
	{
		displayName: 'Section Id',
		name: 'section_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['sections'],
				operation: ['getSectionsSubnets'],
			},
		},
		default: '',
		description: 'All calls which started >= startTime',
	},
];
