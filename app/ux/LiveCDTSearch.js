/**
 * GaiaEHR (Electronic Health Records)
 * Copyright (C) 2013 Certun, LLC.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

Ext.define('App.ux.LiveCDTSearch', {
	extend: 'Ext.form.ComboBox',
	alias: 'widget.cdtlivetsearch',
	hideLabel: true,

	initComponent: function(){
		var me = this;

		Ext.define('liveCDTSearchModel', {
			extend: 'Ext.data.Model',
			fields: [
				{ name: 'id' },
				{ name: 'code' },
				{ name: 'text' }
			],
			proxy: {
				type: 'direct',
				api: {
					read: 'Medical.getCDTLiveSearch'
				},
				reader: {
					totalProperty: 'totals',
					root: 'rows'
				}
			}
		});

		me.store = Ext.create('Ext.data.Store', {
			model: 'liveCDTSearchModel',
			pageSize: 10,
			autoLoad: false
		});

		Ext.apply(this, {
			store: me.store,
			displayField: 'text',
			valueField: 'code',
			emptyText: _('search_for_a_CDT') + '...',
			typeAhead: false,
			hideTrigger: true,
			minChars: 1,
			listConfig: {
				loadingText: _('searching') + '...',
				//emptyText	: 'No matching posts found.',
				//---------------------------------------------------------------------
				// Custom rendering template for each item
				//---------------------------------------------------------------------
				getInnerTpl: function(){
					return '<div class="search-item"><h3>{code}<span style="font-weight: normal"> ({text}) </span></h3></div>';
				}
			},
			pageSize: 10
		});

		me.callParent();
	}
});