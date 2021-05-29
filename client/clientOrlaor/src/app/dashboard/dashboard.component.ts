import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {CallsService} from "../services/calls.service";
import {TableRecordModel} from "../../../../../orlaor-server-crm/src/model/callDto.model";
import {MatSort, Sort} from "@angular/material/sort";

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {
  displayedColumns: string[] = ['name','number','lastCallInput'
    ,'lastCallOutput','numberOfInputCalls','numberOfOutputCalls','status','message1','messageWelcome','delete'];
  dataSource: MatTableDataSource<TableRecordModel> = new MatTableDataSource<TableRecordModel>();

  @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator ;
  @ViewChild(MatSort,{static:false}) sort: MatSort ;

  private sortedData: TableRecordModel[];



  constructor(private callsService:CallsService,private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.callsService.callInformationTwoWeekAgo().then(calls => {
      // Assign the data to the data source for the table to render
      this.dataSource = new MatTableDataSource(calls);
      this.cdr.detectChanges();

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.sortData(this.sort);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  sortData(sort:any) {
    const data = this.dataSource.data.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return this.compare(a.name, b.name, isAsc);
        case 'number': return this.compare(a.number, b.number, isAsc);
        case 'lastCallInput': return this.compare(a.lastCallInput, b.lastCallInput, isAsc);
        case 'lastCallOutput': return this.compare(a.lastCallOutput, b.lastCallOutput, isAsc);
        case 'numberOfInputCalls': return this.compare(a.numberOfInputCalls, b.numberOfInputCalls, isAsc);
        case 'numberOfOutputCalls': return this.compare(a.numberOfOutputCalls, b.numberOfOutputCalls, isAsc);
        case 'status': return this.compare(a.status, b.status, isAsc);
        case 'redSignal': return this.compare(a.redSignal ? 1 : 0 , b.redSignal ? 1 : 0, isAsc);

        default: return this.compare(a.redSignal ? 1 : 0 , b.redSignal ? 1 : 0, isAsc);
      }
    });
  }
 compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

  async hideRow(row: TableRecordModel) {

    console.log(row);
  }
}


