import { Component, OnInit } from '@angular/core';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {CallsService} from "../services/calls.service";
import {TableRecordModel} from "../../../../../orlaor-server-crm/src/model/callDto.model";

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements AfterViewInit,OnInit {
  displayedColumns: string[] = ['id', 'name', 'progress', 'fruit'];
  dataSource: MatTableDataSource<TableRecordModel> = new MatTableDataSource<TableRecordModel>();

  constructor(private callsService:CallsService) {
  }

  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator ;
  // @ts-ignore
  @ViewChild(MatSort) sort: MatSort ;


  ngOnInit(): void {
    this.callsService.callInformationTwoWeekAgo().then(calls => {
      // Assign the data to the data source for the table to render
      this.dataSource = new MatTableDataSource(calls);
    });
    }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}


