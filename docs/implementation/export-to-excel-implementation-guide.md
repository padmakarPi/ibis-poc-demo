# Export to Excel Implementation Guide - Documentation

## Overview
This document provides an overview of the implementation for exporting data to Excel, including API endpoints, Python script workflow, task creation, and frontend integration.

## Overall Workflow

![Workflow](../assets/export-to-excel-generic-diagram.png)

## Implementation Steps

### Step 1: API Endpoint for Data Retrieval
An API endpoint is required to fetch the data for Excel export. The response should be an array of key-value pairs where:
- **key** serves as the header of the Excel file.
- **value** represents the column data.

#### **Example Response:**
```json
[
    {
        "Status": "New",
        "Progress": "",
        "Raised By": "Gazanfar Ansari",
        "Created On": "2025-01-27T09:30:05.958Z",
        "Updated On": "2025-01-27T10:09:01.445Z",
        "Name": "T",
        "Resolver Group": "Vships FMC",
        "Priority": "Urgent",
        "Due Date": "2025-02-06T14:35:07.861Z",
        "Ticket Type": "Vessel setup issues",
        "Vessel Name": "",
        "Ticket No.": "25-7386",
        "Agent": "",
        "Closed On": "",
        "Task Count": ""
    }
]
```

#### **Paginated Response Example Response:**
```json
{
    "paginationResponse": {
        "totalRecords": 1884
    },
    "result": [
        {
            "Status": "New",
            "Progress": "",
            "Raised By": "Gazanfar Ansari",
            "Created On": "2025-01-27T09:30:05.958Z",
            "Updated On": "2025-01-27T10:09:01.445Z",
            "Name": "T",
            "Resolver Group": "Vships FMC",
            "Priority": "Urgent",
            "Due Date": "2025-02-06T14:35:07.861Z",
            "Ticket Type": "Vessel setup issues",
            "Vessel Name": "",
            "Ticket No.": "25-7386",
            "Agent": "",
            "Closed On": "",
            "Task Count": ""
        },
        {
            "Status": "Open",
            "Progress": "",
            "Raised By": "system system",
            "Created On": "2025-01-24T12:51:47.566Z",
            "Updated On": "2025-01-30T06:45:42.261Z",
            "Name": "Updates from All Company, All Company and more at Vships",
            "Resolver Group": "Vships FMC",
            "Priority": "Urgent",
            "Due Date": "2025-02-03T17:56:48.328Z",
            "Agent": "Kamlesh   Dandi",
            "Ticket Type": "Vessel setup issues",
            "Ticket No.": "25-7385",
            "Vessel Name": "",
            "Closed On": "",
            "Task Count": ""
        }
        
    ]
}
```

**Notes:**
- Ensure all values are of primitive types (string, date, number, boolean, etc.).
- If a property has no value, assign an empty string.

### Step 2: Create Python Script for Export Workflow
A Python script is implemented to handle the workflow of exporting data to Excel. It performs the following steps:
1. Fetches data from the API.
2. Generates an Excel document.
3. Uploads the document.
4. Sends a notification upon completion.

Once script is ready upload to TaskLibrary (Shipyard https://dev.shipsure.com/shipyard) and get the **libraryId**.

#### **Python script example**
```python
import json
import os
import sys
import time
from urllib.parse import urlencode, urljoin
from openpyxl import Workbook
from datetime import datetime, timezone
import mimetypes
import logging
import traceback
import aiohttp
import asyncio
import requests

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

class ScriptPayload:
    def __init__(
        self, 
        exportDataUrl, 
        exportDataMethod, 
        exportDataIsPaginated,
        exportDataPageSize,
        exportDataBody, 
        exportDataQueryParams, 
        documentBaseUrl, 
        uploadDocumentTypeId, 
        exportExcelColumns, 
        notificationBaseUrl, 
        taskId,
        taskBaseUrl,
        userId, 
        sourceApplicationId,
        customerId,
        exportDataPaginationTotalRecordCountKey,
        exportExcelFileNamePrefix = None
        ):
        self.exportDataUrl = exportDataUrl
        self.exportDataMethod = exportDataMethod
        self.exportDataIsPaginated = exportDataIsPaginated
        self.exportDataPageSize = exportDataPageSize
        self.exportDataBody = exportDataBody
        self.exportDataQueryParams = exportDataQueryParams
        self.documentBaseUrl = documentBaseUrl
        self.uploadDocumentTypeId = uploadDocumentTypeId
        self.exportExcelColumns = exportExcelColumns
        self.notificationBaseUrl = notificationBaseUrl
        self.taskId = taskId
        self.taskBaseUrl = taskBaseUrl
        self.userId = userId
        self.sourceApplicationId = sourceApplicationId
        self.customerId = customerId
        self.exportDataPaginationTotalRecordCountKey = exportDataPaginationTotalRecordCountKey
        self.exportExcelFileNamePrefix = exportExcelFileNamePrefix

class ExportExcelException(Exception):
    def __init__(self, message, original_exception=None):
        super().__init__(f"ERROR EXPORT EXCEL: {message}")
        self.original_exception = original_exception
        if original_exception:
            self.traceback = traceback.format_exc()


async def main():
    log('Script execution started.')
    
    if len(sys.argv) > 1:
        json_string = str(sys.argv[1])
         
        script_payload = json_string_to_object(json_string, ScriptPayload)

        export_data = await fetch_export_data(script_payload)
        log('Fetched data successfully.')
        
        file_name = create_excel_document(export_data, script_payload,script_payload.exportExcelFileNamePrefix)
        log(f'{file_name} file created successfully.')

        upload_response = upload_document(file_name, script_payload.uploadDocumentTypeId, file_name, script_payload)
        pre_signed_url_params = upload_response["preSignedUrlParams"]
        log(f'{file_name} file uploaded successfully and pre signed url params {pre_signed_url_params}.')
        
        url = generate_url(script_payload.documentBaseUrl, f'v1/pre-signed/download{pre_signed_url_params}')
        await send_notification(script_payload, url)
        log(f'Notification send successfully for this {file_name} file.')
        
    else:
        raise ExportExcelException('No argument passed.')
        
    log('Script execution completed.')


async def fetch_export_data(script_payload):
    token = get_token(script_payload.customerId)
    headers = {'Authorization': f'Bearer {token}'}

    if script_payload.exportDataMethod.upper() == 'GET':
        if script_payload.exportDataIsPaginated == 'True':
            return await fetch_get_paginated_api(script_payload, headers)
        else:
            return await fetch_get_api(script_payload, headers)
    
    elif script_payload.exportDataMethod.upper() == 'POST':
        if script_payload.exportDataIsPaginated == 'True':
            return await fetch_post_paginated_api(script_payload, headers)
        else:
            return await fetch_post_api(script_payload, headers)

    else:
        raise ExportExcelException(f"Unsupported HTTP method: {script_payload.exportDataMethod}")


async def fetch_get_api(script_payload, headers):
    try:
        url = script_payload.exportDataUrl
        params = script_payload.exportDataQueryParams or {}
        url += f"?{urlencode(params)}"
        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=headers) as response:
                if response.status >= 200 and response.status < 300:
                    return await response.json()
                else:
                    raise ExportExcelException(f"Failed GET API: {await response.text()}")

    except Exception as e:
        raise ExportExcelException("Error in fetch_get_api", e)


async def fetch_get_paginated_api(script_payload, headers):
    try:
        url = script_payload.exportDataUrl
        params = script_payload.exportDataQueryParams or {}
        page_size = script_payload.exportDataPageSize
        all_data = []

        async def fetch_page(page_number):
            params.update({'pageNumber': page_number, 'pageSize': page_size})
            async with aiohttp.ClientSession() as session:
                async with session.get(f"{url}?{urlencode(params)}", headers=headers) as response:
                    if response.status >= 200 and response.status < 300:
                        return await response.json()
                    else:
                        raise ExportExcelException(f"Failed GET Paginated API: {await response.text()}")

        first_page_data = await fetch_page(1)
        
        all_data.extend(get_items_from_response(script_payload,first_page_data))
        total_records = get_total_records_count_from_response(script_payload,first_page_data)

        total_pages = (total_records + page_size - 1) // page_size

        if total_pages > 1:
            tasks = [fetch_page(page) for page in range(2, total_pages + 1)]
            results = await asyncio.gather(*tasks)
            for result in results:
                all_data.extend(get_items_from_response(script_payload,result))

        return all_data

    except Exception as e:
        raise ExportExcelException("Error in fetch_get_paginated_api", e)


async def fetch_post_api(script_payload, headers):
    try:
        url = script_payload.exportDataUrl
        body = script_payload.exportDataBody
        async with aiohttp.ClientSession() as session:
            async with session.post(url, headers=headers, json=body) as response:
                if response.status >= 200 and response.status < 300:
                    return await response.json()
                else:
                    raise ExportExcelException(f"Failed POST API: {await response.text()}")

    except Exception as e:
        raise ExportExcelException("Error in fetch_post_api", e)


async def fetch_post_paginated_api(script_payload, headers):
    try:
        url = script_payload.exportDataUrl
        page_size = script_payload.exportDataPageSize
        all_data = []

        async def fetch_page(page_number):
            body = script_payload.exportDataBody.copy()
            body.update({'pageNumber': page_number, 'pageSize': page_size})
            async with aiohttp.ClientSession() as session:
                async with session.post(url, headers=headers, json=body) as response:
                    if response.status >= 200 and response.status < 300:
                        return await response.json()
                    else:
                        raise ExportExcelException(f"Failed POST Paginated API: {await response.text()}")

        first_page_data = await fetch_page(1)
        
        all_data.extend(get_items_from_response(script_payload,first_page_data))
        total_records = get_total_records_count_from_response(script_payload,first_page_data)
        
        total_pages = (total_records + page_size - 1) // page_size

        if total_pages > 1:
            tasks = [fetch_page(page) for page in range(2, total_pages + 1)]
            results = await asyncio.gather(*tasks)
            for result in results:
                all_data.extend(get_items_from_response(script_payload,result))

        return all_data

    except Exception as e:
        raise ExportExcelException("Error in fetch_post_paginated_api", e)


def get_items_from_response(script_payload, data):
    if(script_payload.exportDataPaginationTotalRecordCountKey == "totalRecords"):
        return data.get('result', [])
    elif(script_payload.exportDataPaginationTotalRecordCountKey == "totalItems"):
        return data.get('items', [])
    else:
        raise ExportExcelException("get_items_from_response Response format not supported")

   
def get_total_records_count_from_response(script_payload, data):
    if(script_payload.exportDataPaginationTotalRecordCountKey == "totalRecords"):
        return data.get('paginationResponse', {}).get('totalRecords', 0)
    elif(script_payload.exportDataPaginationTotalRecordCountKey == "totalItems"):
        return data.get('totalItems', 0)
    else:
        raise ExportExcelException("get_total_records_count_from_response Response format not supported")
    

def create_excel_document(data, script_payload, name_prefix=None):
    try:
        if not os.path.exists('reports'):
            os.makedirs('reports')

        if name_prefix:
            filename = f"reports/{name_prefix}{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}.xlsx"
        else:
            timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
            filename = f"reports/output_{timestamp}.xlsx"

        wb = Workbook()
        ws = wb.active
        headers = [col for col in script_payload.exportExcelColumns if col in data[0]]
        ws.append(headers)

        for row in data:
            filtered_row = {key: row[key] for key in headers}
            ws.append(list(filtered_row.values()))

        wb.save(filename)
        return filename
    except Exception as error:
        raise ExportExcelException("Error in create excel document", error)


def upload_document(file_path, document_type_id, friendly_file_name, script_payload):
    token = get_token(script_payload.customerId)
    
    try:
        document_data = {
            'documentypeId': document_type_id,
            'friendlyFileName': friendly_file_name,
            'isDownable': True,
            'isReplicable': True,
            'isLowBandwidth': True
        }

        mime_type, _ = mimetypes.guess_type(file_path)

        if file_path.endswith('.xlsx'):
            mime_type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

        if not mime_type:
            mime_type = 'application/octet-stream'

        file = open(file_path, 'rb')
        try:
            files = {
                'file': (file_path, file, mime_type)
            }

            headers = {
                'Authorization': f'Bearer {token}',
            }

            url = generate_url(script_payload.documentBaseUrl, 'v1/pre-signed/uploadDocument')
            response = requests.post(url, headers=headers, data=document_data, files=files)

            if response.status_code == 201:
                log("Document uploaded successfully")
            else:
                log(f"Error uploading document: {response.status_code}")
                print(response.text)
        finally:
            file.close()

        time.sleep(1)

        try:
            os.remove(file_path)
            log(f"File {file_path} deleted successfully")
        except Exception as delete_error:
            log(f"Error deleting file {file_path}: {delete_error}")

        return response.json() if response.status_code == 201 else None
    except Exception as error:
        raise ExportExcelException("Error in uploading document", error)


async def send_notification(script_payload, redirect_url):
    try:
        created_datetime = datetime.now(timezone.utc).isoformat()

        payload = {
            "sender": script_payload.userId,
            "receiver": [
                {"userId": script_payload.userId, }
                ],
            "state": "Pending",
            "subject": 'Your Excel File is Ready!',
            "body": f'<p>Click <a href="{redirect_url}" download>Download</a> to get your file.</p>',
            "icon": "ChatOutlinedIcon",
            "acknowledgedDateTime": None,
            "acknowledgedBy": None,
            "redirectURL": redirect_url,
            "acknowledgementType": "Direct",
            "sourceApplicationId": script_payload.sourceApplicationId,
            "acknowledgementRequired": False,
            "priority": "Urgent",
            "notificationId": 1,
            "createdDateTime": created_datetime,
            "taskId":script_payload.taskId 
        }

        token = get_token(script_payload.customerId)
        headers = {
        'Accept': 'application/json',
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
        url = script_payload.notificationBaseUrl + '/v1/notify'
        async with aiohttp.ClientSession() as session:
            async with session.post(url, headers=headers, data=json.dumps(payload)) as response:
                response.raise_for_status()
                return response
    except Exception as error:
        raise ExportExcelException("Error in sending notification", error)


def get_token(customer_id):
    try:
        omni_jwt_issuer = os.environ.get('OMNI_JWT_ISSUER')
        omni_client_id = os.environ.get('CLIENT_ID')
        omni_client_secret = os.environ.get('CLIENT_SECRET')
        
        if omni_jwt_issuer:
            omni_jwt_issuer = omni_jwt_issuer.split(',')[0]
 
            url = generate_url(omni_jwt_issuer, 'connect/token')
            
            data = {
                "grant_type": 'client_credentials',
                "client_id": omni_client_id,
                "client_secret": omni_client_secret,
                "CustomerId": customer_id
            }
            encoded_data = urlencode(data)
            headers = {"Content-Type": "application/x-www-form-urlencoded"}
            response = requests.post(url, data=encoded_data, headers=headers, verify=True)
            success = response.json()
            return success["access_token"]
    except Exception as error:
        raise ExportExcelException(f"Error in get token", error)


def json_string_to_object(json_string, class_type):
    try:
        data = json.loads(json_string)
        object_instance = class_type(**data)
        return object_instance
    except Exception as error:
        raise ExportExcelException(f"Error in converting json string to object", error)


def log(message):
    logging.info(f"EXPORT EXCEL: {message}")


def generate_url(base_url, path=''):
    if not base_url.endswith('/'):
        base_url += '/'
    full_url = urljoin(base_url, path)
    return full_url


if __name__ == "__main__":
    asyncio.run(main())

```


## Step 3: Frontend Implementation
The frontend integrates the export-to-Excel functionality by:
1. Add one env variable (process.env.NEXT_PUBLIC_EXPORT_TO_EXCEL_PYTHON_SCRIPT_LIBRARY_ID) in .env file to get libraryId (libraryId is ID which we get once we upload the script in task library)
2. Creating a manual type task.
3. Updating it to a scheduled type task with the required payload.

## Payload Details
The payload structure consists of the following properties:

| Property Name                                        | Description                                                                 | Required | Expected Values         |
|------------------------------------------------------|-----------------------------------------------------------------------------|----------|-------------------------|
| **libraryId**                                         | Identifies the VTask library (Python script)                                | Yes      | Integer                 |
| **data**                                              | Contains required details for the script execution                         | Yes      | JSON Object             |
| **data.exportDataUrl**                                | API endpoint URL for fetching data                                         | Yes      | String (URL)            |
| **data.exportDataMethod**                             | HTTP method (POST/GET)                                                     | Yes      | "POST", "GET"           |
| **data.exportDataIsPaginated**                        | Specifies if pagination is enabled                                         | Yes      | "True", "False"         |
| **data.exportDataPageSize**                           | Page size for paginated responses. Set 0 if not required                   | Yes      | Integer                 |
| **data.exportDataBody**                               | Request body for the API call. Set {} if not required                      | Yes      | JSON Object             |
| **data.exportDataQueryParams**                        | Query parameters. Set {} if not required                                    | Yes      | JSON Object             |
| **data.exportDataPaginationTotalRecordCountKey**      | KeyName for total record count in paginated responses. Set "" if not required | Yes      | String                  |
| **data.documentBaseUrl**                              | Base URL for document service                                              | Yes      | String (URL)            |
| **data.uploadDocumentTypeId**                         | Document type ID. Value you can get from VDocument service team            | Yes      | Integer                 |
| **data.exportExcelColumns**                           | Columns to be included in the Excel file                                    | Yes      | Array of Strings        |
| **data.exportExcelFileNamePrefix**                    | File name prefix for the exported Excel file                                | No       | String                  |
| **data.notificationBaseUrl**                          | Base URL for notification service                                           | Yes      | String (URL)            |
| **data.userId**                                       | Logged-in user ID                                                          | Yes      | String (UUID)           |
| **data.sourceApplicationId**                          | Client application ID                                                      | Yes      | String                  |
| **data.customerId**                                   | Customer ID                                                                | Yes      | Number                  |
| **data.taskId**                                       | Task ID for Notification tracking                                                        | Yes      | Number                  |
| **data.taskBaseUrl**                                  | Base URL for VTask service                                                 | Yes      | String (URL)            |



### **Frontend Code Example**
```typescript
const handleExportToExcel = async () => {
		try {
			setIsLoading(true);

			const loggedInUserDetails: any = jwtDecode(
				new AuthService().getOMNITokenData()?.access_token || "",
			);

			const now = new Date();
			const formattedDate = now
				.toLocaleString("en-GB", {
					day: "2-digit",
					month: "2-digit",
					year: "2-digit",
					hour: "2-digit",
					minute: "2-digit",
					second: "2-digit",
					hour12: false,
				})
				.replace(",", "");

			const libraryId = Number(
				process.env.NEXT_PUBLIC_EXPORT_TO_EXCEL_PYTHON_SCRIPT_LIBRARY_ID,
			);

			const createTaskRequest = {
				schemaId: 1,
				type: taskTypeEnum.MANUAL,
				source: `VLink`,
				sourceURL: ``,
				description: `VLink Tickets Export To Excel: ${formattedDate}`,
				status: MESSAGE_STATUS_ENUM.OPEN,
				labels: [
					{
						key: "TITLE",
						value: `VLink Tickets Export To Excel: ${formattedDate}`,
					},
				],
				taskExecutionType: "Python Script",
			};

			const createTaskResponse = await createTicketV3Api(createTaskRequest);
			const taskId = createTaskResponse.data.result;

			const taskResponse = await getTaskByTaskIdApiV3(taskId);
			const task = taskResponse.data.result;

			task.type = taskTypeEnum.SCHEDULER;
			task.payload = {
				libraryId,
				data: {
					exportDataUrl: `${process.env.NEXT_PUBLIC_VTASK_BASE_API_URL}/v1/my-tasks-display-columns`,
					exportDataMethod: "POST",
					exportDataIsPaginated: "True",
					exportDataPageSize: 100,
					exportDataBody: {
						taskIds,
						pageNumber: 1,
						pageSize: 100,
						displayColumns: localSelectedColumns?.map(column => ({
							fieldName: column.field,
							displayColumnName: column.headerName,
						})),
					},
					exportDataQueryParams: {},
					documentBaseUrl: process.env.NEXT_PUBLIC_VDOCUMENTS_BASE_API_URL,
					uploadDocumentTypeId: 5,
					exportExcelColumns: localSelectedColumns?.map(
						column => column.headerName,
					),
					notificationBaseUrl:
						process.env.NEXT_PUBLIC_VNOTIFICATION_BASE_API_URL,
					userId: loggedInUserDetails.sub,
					sourceApplicationId: process.env.NEXT_PUBLIC_CLIENT_ID,
					customerId: loggedInUserDetails.CustomerId,
					taskId,
					taskBaseUrl: process.env.NEXT_PUBLIC_VTASK_BASE_API_URL,
					exportDataPaginationTotalRecordCountKey: "totalRecords",
					exportExcelFileNamePrefix: "ticketlist_",
				},
			};

			task.scheduleDetails = [
				{
					startDate: new Date(),
					type: "onetime",
				},
			];

			await updateTicketTaskApiV4(taskId, task);
			enqueueSnackbar({
				variant: "success",
				icon: <CheckCircleIcon />,
				onClose: () => closeSnackbar(),
				message: (
					<Box mt={-1} display="flex" alignItems="center">
						<Box>
							<Typography variant="subtitle1" fontWeight="bold">
								Request Submitted
							</Typography>
							<Typography variant="body2">
								We will notify you when the excel get generated.
							</Typography>
						</Box>
					</Box>
				),
			});
			setIsLoading(false);
		} catch (error) {
			console.error("Export to excel =>", error);
		} finally {
			setIsLoading(false);
		}
	};

```

