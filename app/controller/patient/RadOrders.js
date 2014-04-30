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

Ext.define('App.controller.patient.RadOrders', {
	extend: 'Ext.app.Controller',
	requires: [

	],
	refs: [
		{
			ref: 'RadOrdersGrid',
			selector: 'patientradorderspanel'
		},
		{
			ref: 'PrintRadOrderBtn',
			selector: 'patientradorderspanel #printRadOrderBtn'
		}
	],

	init: function(){
		var me = this;
		me.control({
			'patientradorderspanel': {
				activate: me.onRadOrdersGridActive,
				selectionchange: me.onRadOrdersGridSelectionChange
			},
			'#radOrderliveSearch': {
				select: me.onRadSearchSelect
			},
			'patientradorderspanel #newRadOrderBtn': {
				click: me.onNewRadOrderBtnClick
			},
			'patientradorderspanel #printRadOrderBtn': {
				click: me.onPrintRadOrderBtnClick
			}
		});
	},

	onRadSearchSelect:function(cmb, records){
		var form = cmb.up('form').getForm();
		form.getRecord().set({code: records[0].data.loinc_number});
		form.findField('code').setValue(records[0].data.loinc_number);
		form.findField('note').focus(false, 200);
	},

	onRadOrdersGridSelectionChange: function(sm, selected){
		this.getPrintRadOrderBtn().setDisabled(selected.length == 0);
	},

	onNewRadOrderBtnClick: function(){
		var me = this,
			grid = me.getRadOrdersGrid(),
			store = grid.getStore();

		grid.editingPlugin.cancelEdit();
		store.insert(0, {
			pid: app.patient.pid,
			eid: app.patient.eid,
			uid: app.user.id,
			date_ordered: new Date(),
			order_type: 'rad',
			status: 'Pending',
			priority: 'Normal'
		});
		grid.editingPlugin.startEdit(0, 0);
	},

	onPrintRadOrderBtnClick: function(){
		var me = this,
			grid = me.getRadOrdersGrid(),
			items = grid.getSelectionModel().getSelection(),
			params = {},
			data,
			i;

		params.pid = app.patient.pid;
		params.eid = app.patient.eid;
		params.orderItems = [ ];
		params.docType = 'Rad';

		params.templateId = 6;
		params.orderItems.push(['Description', 'Notes']);
		for(i = 0; i < items.length; i++){
			data = items[i].data;
			params.orderItems.push([
					data.description + ' [' + data.code_type + ':' + data.code + ']',
				data.note
			]);
		}

		DocumentHandler.createTempDocument(params, function(provider, response){
			if(dual){
				dual.onDocumentView(response.result.id, 'Rad');
			}else{
				app.onDocumentView(response.result.id, 'Rad');
			}
		});
	},

	onRadOrdersGridActive:function(grid){
		var store = grid.getStore();

		store.clearFilter(true);
		store.filter([
			{
				property: 'pid',
				value: app.patient.pid
			},
			{
				property: 'order_type',
				value: 'rad'
			}
		]);
	},

	radOrdersGridStatusColumnRenderer:function(v){
		var color = 'black';

		if(v == 'Canceled'){
			color = 'red';
		}else if(v == 'Pending'){
			color = 'orange';
		}else if(v == 'Routed'){
			color = 'blue';
		}else if(v == 'Complete'){
			color = 'green';
		}

		return '<div style="color:' + color + '">' + v + '</div>';
	}


});