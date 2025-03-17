# Export to Excel Implementation Guide - Documentation

## Overview
This document provides an overview of the implementation for exporting data to Excel **from grid**,  task creation, and frontend integration. You can use the same approach in your application.

## Overall Workflow

![Workflow](../assets/export-to-excel-generic-diagram.png)


### Steps to Implement Export to Excel Workflow

1. **Create an API Endpoint** that:
   - Fetches all the required data
   - Creates an Excel document
   - Uploads the document
   - Generates a download URL
   - Sends a notification with the download URL
2. **Implement frontend logic** to create a scheduled task with all the necessary payloads.



## Below is Vlink Export To Excel  Implementation


### Step 1: Create API Endpoint
This endpoint will handle:
1. Fetching required data
2. Processing the data for Excel
3. Generating the Excel document
4. Uploading the document to VDocument Service
5. Generating a download URL
6. Sending a notification with the download URL


#### Vlink API Endpoint Example

Install this below package

```bash
npm i exceljs date-fns
```

```typescript

// vlink.controller.ts

export class VLinkController {
  constructor(private readonly exportToExcelWorkflowService: ExportToExcelWorkflowService) { }

@Post('export-to-excel')
  @ApiOperation({
    summary: 'Export to excel.',
    description: 'This endpoint exports the provided data into an Excel file.',
  })
  @ApiCreatedResponse({
    description: 'Excel file export has been successfully initiated.',
    type: String,
  })
  @ApiBody({
    description: 'Request body to exported to Excel.',
    type: ExportExcelDataRequest,
  })
  async exportExcelData(
    @Body() request: ExportExcelDataRequest,
    @DecodeJwtToken() decodedToken: any,
  ): Promise<string> {
    const { customerId } = _getDecodedTokenData(decodedToken);
    this.exportToExcelWorkflowService.exportData(request,customerId);
    return Message.EXPORT_EXCEL_PROCESS_MESSAGE;
  }

}
  ```


  ```typescript
//message.constant.ts

export const Message = {
  EXPORT_EXCEL_PROCESS_MESSAGE: 'Export to Excel process has started. You will be notified once completed.',
};

  ```



```typescript
  //export-to-excel.request.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsString,
    ValidateNested,
} from 'class-validator';

class DisplayColumn {
    @ApiProperty({
        description: 'Field name of the column.',
        example: 'status',
        type: String,
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    fieldName: string;

    @ApiProperty({
        description: 'Display column name.',
        example: 'Status',
        type: String,
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    displayColumnName: string;
}

class ExportDataBody {

    @ApiProperty({
        description: 'Task IDs to export.',
        example: [13813, 13795, 13794],
        type: [Number],
        required: true,
    })
    @IsArray({ message: 'taskIds must be an array of numbers.' })
    @IsNumber({}, { each: true, message: 'Each TaskId must be a number.' })
    taskIds: number[];

    @ApiProperty({
        description: 'Page number for pagination.',
        example: 1,
        type: Number,
        required: true,
    })
    @IsInt({ message: 'Page number must be an integer.' })
    pageNumber: number;

    @ApiProperty({
        description: 'Page size for pagination.',
        example: 10,
        type: Number,
        required: true,
    })
    @IsInt({ message: 'Page size must be an integer.' })
    pageSize: number;

    @ApiProperty({
        description: 'List of columns to be displayed in the export.',
        example: [
            { fieldName: 'status', displayColumnName: 'Status' },
        ],
        type: [DisplayColumn],
        required: true,
    })
    @IsArray()
    @IsNotEmpty({ message: 'displayColumns cannot be empty.' })
    @ValidateNested({ each: true })
    @Type(() => DisplayColumn)
    displayColumns: DisplayColumn[];

}

export class ExportExcelDataRequest {


    @ApiProperty({
        description: 'export data request body.',
        example: {
            taskIds: [
                12907,
                12904,
                12902,
                12892
            ],
            pageNumber: 1,
            pageSize: 25,
            displayColumns: [
                {
                    fieldName: "TICKETNUMBER",
                    displayColumnName: "Ticket No."
                },
                {
                    fieldName: "TITLE",
                    displayColumnName: "Name"
                },
                {
                    fieldName: "VESSEL",
                    displayColumnName: "Vessel Name"
                }
            ]
        },
        type: ExportDataBody,
        required: true,
    })
    @IsObject()
    @IsNotEmpty({ message: 'exportDataRequestBody cannot be empty.' })
    @ValidateNested()
    @Type(() => ExportDataBody)
    exportDataBody: ExportDataBody;


    @ApiProperty({
        description: 'Task ID for the export request.',
        example: 12345,
        type: Number,
        required: true,
    })
    @IsNumber({}, { message: 'taskId must be a number.' })
    taskId: number;

    @ApiProperty({
        description: 'Source application ID.',
        example: '0896c4c3-e70b-4f84-9054-d6b57e5351d2',
        type: String,
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    sourceApplicationId: string;

    @ApiProperty({
        description: 'User ID making the export request.',
        example: '48ab3eaf-f856-4339-a004-4fe62b9544c7',
        type: String,
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    userId: string;

    @ApiProperty({
        description: 'List of columns to be exported in the Excel file.',
        example: ['Vessel Name', 'Resolver Group'],
        type: [String],
        required: true,
    })
    @IsArray()
    @IsString({ each: true })
    exportExcelColumns: string[];

    @ApiProperty({
        description: 'Document type ID for the upload.',
        example: 5,
        type: Number,
        required: true,
    })
    @IsNumber({}, { message: 'uploadDocumentTypeId must be a number.' })
    uploadDocumentTypeId: string;

}

```
```typescript
//export-excel-workflow.service.ts

import { Injectable } from "@nestjs/common";
import { LoggerHelperService } from "src/common/services/logger-helper.service";
import { Workbook } from 'exceljs';
import { existsSync, promises as fsPromise, mkdirSync } from 'fs';
import axios, { AxiosResponse } from 'axios';
import * as path from 'path';
import { JWT_ISSUER, OMNI_JWT_CLIENT_ID, OMNI_JWT_CLIENT_SECRET, VDOCUMENTNODEJS_URL, VNOTIFICATION_BASE_API_URL, VTASK_BASE_API_URL } from "src/config";
import { join } from "path";
import { ExportExcelDataRequest } from "../dtos/request";
import { UUID } from "mongodb";
import { isValid, format, parseISO } from 'date-fns';

@Injectable()
export class ExportToExcelWorkflowService {
    constructor(
        private readonly loggerHelperService: LoggerHelperService
    ) { }

    async exportData(requestDto: ExportExcelDataRequest, customerId: number): Promise<void> {

        const requestId = new UUID().toString();

        try {

            const taskDisplayColumns = await this.fetchAllTaskDisplayColumns(requestDto, customerId);

            const filePath = await this.createExcelDocument(requestDto, taskDisplayColumns);

            const uploadResponse = await this.uploadDocument(requestDto, filePath, customerId);

            const preSignedUrlParams = uploadResponse["preSignedUrlParams"]
            const downloadUrl = `${VDOCUMENTNODEJS_URL}/v1/pre-signed/download${preSignedUrlParams}`

            await this.sendNotification(requestDto, downloadUrl, customerId);

        } catch (error) {
            this.loggerHelperService.logData(
                'ExportToExcelWorkflow',
                customerId,
                error.stack,
                "Export To Excel failed",
                requestId,
                true
            )
        }
    }

    private async fetchAllTaskDisplayColumns(requestDto: ExportExcelDataRequest, customerId: number): Promise<any> {
        const token = await this.getOmniToken(customerId);
        const headers = { Authorization: `Bearer ${token}` };
        const url = `${VTASK_BASE_API_URL}/v1/my-tasks-display-columns`;

        const request = requestDto.exportDataBody;

        const { data: firstPageResponse } = await axios.post(url, request, { headers }) as AxiosResponse<{
            paginationResponse: {
                totalRecords: number;
            };
            result: any[];
        }, any>;

        const totalRecords = firstPageResponse.paginationResponse.totalRecords;
        const totalPages = Math.ceil(totalRecords / request.pageSize);

        let allResults = [];
        allResults = allResults.concat(firstPageResponse.result);

        if (totalPages > 1) {
            const fetchPage = async (pageNumber: number) => {
                const pageRequest = {
                    ...request,
                    pageNumber,
                };

                const { data } = await axios.post(url, pageRequest, { headers });
                return data.result;
            };

            const tasks = [];
            for (let page = 2; page <= totalPages; page++) {
                tasks.push(fetchPage(page));
            }

            const pageResults = await Promise.all(tasks);

            pageResults.forEach((result) => {
                allResults = allResults.concat(result);
            });
        }

        return allResults;
    }

    private async createExcelDocument(requestDto: ExportExcelDataRequest, data: any[]): Promise<string> {

        const reportsDir = join(process.cwd(), 'reports');

        if (!existsSync(reportsDir)) {
            mkdirSync(reportsDir, { recursive: true });
        }

        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Exported Data');

        const exportExcelColumns = requestDto.exportExcelColumns || [];

        worksheet.columns = exportExcelColumns.map(h => ({ header: h, key: h }))

        data.forEach(row => {
            const rowData = exportExcelColumns.map(column => this.getRowData(row, column));
            const addedRow = worksheet.addRow(rowData);

            addedRow.eachCell((cell, colNumber) => {
                const value = cell.value;

                if (this.isValidDate(value)) {
                    cell.numFmt = 'm/d/yyyy';
                }
            });

        });

        const currentDateTime = this.getFormattedDateTime();

        const fileName = `ticketlist_${currentDateTime}.xlsx`;
        const filePath = path.join(reportsDir, fileName);
        await workbook.xlsx.writeFile(filePath);
        return filePath;
    }

    private async uploadDocument(requestDto: ExportExcelDataRequest, filePath: string, customerId: number): Promise<{ preSignedUrlParams: string }> {
        const token = await this.getOmniToken(customerId);
        const fileBuffer = await fsPromise.readFile(filePath);
        const fileBlob = new Blob([fileBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = `${VDOCUMENTNODEJS_URL}/v1/pre-signed/uploadDocument`;

        const formData = new FormData();
        formData.append('file', fileBlob, path.basename(filePath));
        formData.append('documentypeId', requestDto.uploadDocumentTypeId);
        formData.append('isDownable', "true");
        formData.append('isReplicable', "true");
        formData.append('isLowBandwidth', "true");

        const headers = { Authorization: `Bearer ${token}` };

        const response = await axios.post(url, formData, { headers });

        await fsPromise.unlink(filePath);

        return response.data;
    }

    private async sendNotification(
        requestDto: ExportExcelDataRequest,
        downloadUrl: string,
        customerId: number
    ): Promise<void> {
        const token = await this.getOmniToken(customerId);

        const notificationPayload = {
            sender: requestDto.userId,
            receiver: [{ userId: requestDto.userId }],
            state: "Pending",
            subject: 'Your Excel File is Ready!',
            body: `<p>Click <a href="${downloadUrl}" download>Download</a> to get your file.</p>`,
            redirectURL: downloadUrl,
            icon: "ChatOutlinedIcon",
            acknowledgedDateTime: null,
            acknowledgedBy: null,
            acknowledgementType: "Direct",
            sourceApplicationId: requestDto.sourceApplicationId,
            acknowledgementRequired: false,
            priority: "Urgent",
            notificationId: 1,
            createdDateTime: new Date().toISOString(),
            taskId: requestDto.taskId
        };

        const headers = { Authorization: `Bearer ${token}` };
        const url = `${VNOTIFICATION_BASE_API_URL}/v1/notify`;
        await axios.post(url, notificationPayload, { headers });
    }

    private async getOmniToken(customerId: number): Promise<string> {

        if (!JWT_ISSUER || !OMNI_JWT_CLIENT_ID || !OMNI_JWT_CLIENT_SECRET) {
            throw new Error('Missing required environment variables');
        }

        let issuer = JWT_ISSUER;

        if (issuer.includes(',')) {
            issuer = issuer.split(',')[0];
        }

        const url = this.generateUrl(issuer, 'connect/token');

        const data: any = {
            grant_type: 'client_credentials',
            client_id: OMNI_JWT_CLIENT_ID,
            client_secret: OMNI_JWT_CLIENT_SECRET,
            CustomerId: customerId,
        };

        const encodedData = new URLSearchParams(data).toString();
        const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };

        const response = await axios.post(url, encodedData, { headers });
        const success = response.data;
        return success.access_token;
    }

    private generateUrl(baseUrl: string, path: string = ''): string {
        if (!baseUrl.endsWith('/')) {
            baseUrl += '/';
        }
        const fullUrl = new URL(path, baseUrl).toString();
        return fullUrl;
    }

    private getFormattedDateTime() {
        const currentDate = new Date();
        return format(currentDate, 'yyyy-MM-dd_HH-mm-ss');
    }

    private isValidDate(str: any) {
        try {
            const parsedDate = parseISO(str);
            return isValid(parsedDate);
        } catch (error) {
            return false
        }
    }

    private getRowData(row: any, column: string): any {

        const rowData = row[column];

        if (rowData === undefined || rowData === null) {
            return ""
        } else if (!isNaN(rowData)) {
            return rowData;
        }
        else if (this.isValidDate(rowData)) {
            return new Date(rowData);
        } else {
            return rowData;
        }
    }

}

```

Import **ExportToExcelWorkflowService** in module

```typescript
import { Module } from '@nestjs/common';
import { VLinkController } from './controllers/vlink.controller';
import { INTERFACES } from '../common/v1/constants';
import { VLinkRepository } from './repositories/vlink.repository';
import { VLinkService } from './services/vlink.service';
import { MongoDBModule } from 'src/common/database/mongodb.module';
import MSTSAuthService from 'src/common/services/msts-auth.service';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthModule } from '@vplatform/auth';
import { LoggerHelperService } from 'src/common/services/logger-helper.service';
import { VLoggerModule } from '@vplatform/logger';
import { ExportToExcelWorkflowService } from './services/export-excel-workflow.service';

@Module({
  imports: [MongoDBModule, CacheModule.register(),
    AuthModule.register({issuer: process.env.OMNI_JWT_ISSUER}), VLoggerModule
  ],
  controllers: [VLinkController],
  providers: [
    VLinkService,
    ExportToExcelWorkflowService,
    {
      provide: INTERFACES.IVLINKPOSITORY,
      useClass: VLinkRepository,
    },
    MSTSAuthService,
    LoggerHelperService

  ],
})
export class VLinkModule {}


```

Change in **DockerFile** 


```Dockerfile
RUN mkdir -p /usr/src/app/reports && \
    chown -R node:node /usr/src/app/reports

```

After adding above line it will look something like this

```Dockerfile

FROM node:18-alpine as builder

USER node

WORKDIR /usr/src/app

COPY --chown=node:node .npmrc ./
COPY --chown=node:node package*.json ./

RUN npm ci

RUN rm -f .npmrc

COPY --chown=node:node . .

RUN npm run build \
    && npm prune --production



FROM node:18-alpine

ENV NODE_ENV production

RUN mkdir -p /usr/src/app/logs && \
    chown -R node:node /usr/src/app/logs

RUN mkdir -p /usr/src/app/reports && \
    chown -R node:node /usr/src/app/reports

USER node

WORKDIR /usr/src/app

COPY --from=builder --chown=node:node /usr/src/app/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /usr/src/app/dist/ ./dist/

CMD ["node", "dist/main.js"]


```

In **.gitignore** add this 

```bash
/reports
```

### Step 2: Frontend changes

1. Create Manual type task.
2. Get the taskId.
3. Get task Entity.
4. Update Task type to ***Schedule*** task and add all **payload**.


### Vlink Frontend Code Example


```typescript

const [isLoading, setIsLoading] = useState(false);
const [localSelectedColumns, setLocalSelectedColumns] =
		useState<Columns[]>(columnsConfig);

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
				taskExecutionType: "API",
			};

			const createTaskResponse = await createTicketV3Api(createTaskRequest);
			const taskId = createTaskResponse.data.result;

			const taskResponse = await getTaskByTaskIdApiV3(taskId);
			const task = taskResponse.data.result;

			task.type = taskTypeEnum.SCHEDULER;
			task.payload = {
				url: `${process.env.NEXT_PUBLIC_VLINK_BASE_API_URL}/v1/export-to-excel`,
				method: "post",
				data: {
					exportDataBody: {
						taskIds,
						pageNumber: 1,
						pageSize: 100,
						displayColumns: localSelectedColumns?.map(column => ({
							fieldName: column.field,
							displayColumnName: column.headerName,
						})),
					},
                    //TaskId which is used to store notification under specific task for persistent.
					taskId,
                    //application Id
					sourceApplicationId: process.env.NEXT_PUBLIC_CLIENT_ID,
                    //User Id which get notify
					userId: loggedInUserDetails.sub,
					customerId: loggedInUserDetails.CustomerId,
                    // Based on project id will change. You can get from Document Service Team.
					uploadDocumentTypeId: 5,
                    // Columns which is need to export in excel.
					exportExcelColumns: localSelectedColumns?.map(
						column => column.headerName,
					),
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
			onModalClose();
			setIsLoading(false);
		} catch (error) {
			console.error("Export to excel =>", error);
		} finally {
			setIsLoading(false);
		}
	};



```