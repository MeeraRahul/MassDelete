import {LightningElement, track, wire} from 'lwc';

// importing apex class methods
import getProjects from '@salesforce/apex/LWCExampleController.getProjects';
import delSelectedPros from '@salesforce/apex/LWCExampleController.deleteProjects';

// importing to show toast notifictions
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

// importing to refresh the apex after delete the records.
import {refreshApex} from '@salesforce/apex';

// datatable columns
const columns = [
    {
        label: 'Project Name',
        fieldName: 'Name'
        
    }, 
    {
        label: 'Project Type',
        fieldName: 'Project_Type__c'
    }, 
    {
        label: 'Owner',
        fieldName: 'Owner__c',
        
    }, {
        label: 'End Date',
        fieldName: 'End_Date__c',
        type: 'Date'
    },
    {
        label: 'Status',
        fieldName: 'Status__c',
        type: 'Picklist'
    },
    {
        label: 'priority',
        fieldName: 'Priority__c',
       
    }
];

export default class DeleteRowsInDatatableLWC extends LightningElement {
    // reactive variable
    @track data;
    @track columns = columns;
    @track buttonLabel = 'Delete';
    @track isTrue = false;
    @track recordsCount = 0;

    // non-reactive variables
    selectedRecords = [];
    refreshTable;
    error;

    // retrieving the data using wire service
    @wire(getProjects)
    projects(result) {
        this.refreshTable = result;
        if (result.data) {
            this.data = result.data;
            this.error = undefined;

        } else if (result.error) {
            this.error = result.error;
            this.data = undefined;
        }
    }


    // Getting selected rows 
    getSelectedRecords(event) {
        // getting selected rows
        const selectedRows = event.detail.selectedRows;
        
        this.recordsCount = event.detail.selectedRows.length;

        // this set elements the duplicates if any
        let proIds = new Set();

        // getting selected record id
        for (let i = 0; i < selectedRows.length; i++) {
            proIds.add(selectedRows[i].Id);
        }

        // coverting to array
        this.selectedRecords = Array.from(proIds);

        window.console.log('selectedRecords ====> ' +this.selectedRecords);
    }


    // delete records process function
    deleteProjects() {
        if (this.selectedRecords) {
            // setting values to reactive variables
            this.buttonLabel = 'Processing....';
            this.isTrue = true;

            // calling apex class to delete selected records.
            this.deletePros();
        }
    }


    deletePros() {
        delSelectedPros({lstProIds: this.selectedRecords})
        .then(result => {
            window.console.log('result ====> ' + result);

            this.buttonLabel = 'Delete';
            this.isTrue = false;

            // showing success message
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success!!', 
                    message: this.recordsCount + ' projects are deleted.', 
                    variant: 'success'
                }),
            );
            
            // Clearing selected row indexs 
            this.template.querySelector('lightning-datatable').selectedRows = [];

            this.recordsCount = 0;

            // refreshing table data using refresh apex
            return refreshApex(this.refreshTable);

        })
        .catch(error => {
            window.console.log(error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error while getting Contacts', 
                    message: error.message, 
                    variant: 'error'
                }),
            );
        });
    }  
    
}
