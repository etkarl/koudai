(function ($) {
    $(function () {
        $('#J_ChartContainer1').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: ''
            },
            credits: {
                enabled: false
            },
            colors: [
			    '#4b74bf',
			    '#ffa70d'
            ],
            legend: {
                enabled: false
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                categories: [
                '都市拜金女',
                '校园网购达人',
                '城市名媛',
                '大城市白领男青年',
                '都市拜金女',
                '校园网购达人',
                '城市名媛',
                '大城市白领男青年',
                '都市拜金女',
                '校园网购达人',
                '城市名媛',
                '大城市白领男青年'
            ]
            },
            yAxis: {
                min: 0,
                title: {
                    text: ''
                },
                labels: {
                    style: {
                        'fontFamily': 'Arial'
                    }
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y}</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [{
                name: '样本组',
                data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]

            }, {
                name: '对照组',
                data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]

            }]
        });
        $('#J_ChartContainer2').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: ''
            },
            credits: {
                enabled: false
            },
            colors: [
			    '#4b74bf',
			    '#ffa70d'
            ],
            legend: {
                enabled: false
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                categories: [
                '都市拜金女',
                '校园网购达人',
                '城市名媛',
                '大城市白领男青年',
                '都市拜金女',
                '校园网购达人',
                '城市名媛',
                '大城市白领男青年',
                '都市拜金女',
                '校园网购达人',
                '城市名媛',
                '大城市白领男青年'
            ]
            },
            yAxis: {
                min: 0,
                title: {
                    text: ''
                },
                labels: {
                    style: {
                        'fontFamily': 'Arial'
                    }
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y}</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [{
                name: '样本组',
                data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]

            }, {
                name: '对照组',
                data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]

            }]
        });
    });
})(jQuery)