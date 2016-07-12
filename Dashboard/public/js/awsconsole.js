// JS module for the AWS Console
(function () {
    var __indexOf = [].indexOf || function (item) {
            for (var i = 0, l = this.length; i < l; i++) {
                if (i in this && this[i] === item) return i;
            }
            return -1;
        };

    window.PCW = {};
    window.Dashboard = {};

    PCW.instance_list = [];
    PCW.tag_list = [];
    PCW.match_list = [];
    TIMEOUT_PEROID = 2000;
    REFRESH_PERIOD = 25000;

    PCW.AWSLogin = function () {
        var  message, request;
        if (true) {
            request = new XMLHttpRequest();
            request.open("POST", "/login", true);
            message = "";

            console.log(" ===>> "+document.getElementById('login1').value);
            console.log(" ===>> "+document.getElementById('login2').value);
            console.log(" ===>> "+document.getElementById('login3').value);

            message += document.getElementById('login1').value + ",";
            message += document.getElementById('login2').value + ",";
            message += document.getElementById('login3').value;



            console.log("@@@@ message => "+message);

            // TODO: Our FIRST AWS API CALL
            request.onreadystatechange = function () {
                var i, temp, _i, _ref;
                if (request.readyState === 4) {
                    if (request.status !== 200) {

                       console.log(" ERROR :: Apologies. Amazon has declined this login.   Reason: "+request.responseText);
                        return;
                    } else {
                        temp = request.responseText.split(";");
                        PCW.user_token = temp[0];
                        PCW.instance_list = temp[1].split(",");
                        PCW.tag_list = temp[2].split(",");

                        for (i = _i = 3, _ref = temp.length - 1; 3 <= _ref ? _i <= _ref : _i >= _ref; i = 3 <= _ref ? ++_i : --_i) {
                            PCW.match_list.push(PCW.instance_list[i] + "," + temp[i]);
                        }


                        PCW.instance_list.sort();
                        PCW.tag_list.sort();

                        Dashboard.DeleteDuplicateTags();
                        PCW.LinkTagsToInstances();
                        message = "";
                        document.getElementById('login1').value = "";
                        document.getElementById('login2').value = "";
                        document.getElementById('login3').value = "";
                        console.log("Success!  Connection established.");
                        return document.getElementById('plot_graphs').style.display = "block" ;
                    }
                }
            };
            return request.send(message);
        }
        else {
            window.alert(" ERROR !! Apologies. AWS Login cannot occur without full credentials.");
            return;
        }
    };
    Dashboard.ToggleDialog = function (name) {
        return document.getElementById(name).toggle();
    };

    //TODO: creating no problem -- no id reference
    Dashboard.DeleteDuplicateTags = function () {
        var hold, i, temp_list, _i, _ref;
        if (PCW.tag_list.length > 1) {
            temp_list = [];
            hold = PCW.tag_list[0];
            for (i = _i = 1, _ref = PCW.tag_list.length - 1; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
                if (PCW.tag_list[i] === hold) {

                } else {
                    temp_list.push(hold);
                    hold = PCW.tag_list[i];
                }
                if (i === PCW.tag_list.length - 1 && hold !== temp_list[temp_list.length - 1]) {
                    temp_list.push(hold);
                }
            }
            return PCW.tag_list = temp_list;
        }
    };

    //TODO: Login module for AWS
    PCW.AWSDataController = function () {
        PCW.AWSLogin();

        document.getElementById("mainhead").style.display="none";

        setTimeout(function(){
            console.log("In setTimeOut");
            PCW.PullMetrics();
        }, TIMEOUT_PEROID);

        setInterval(function(){
            console.log("--> In timeout 2");
            PCW.PullMetrics();
            PCW.GetDashBoardData();
        }, REFRESH_PERIOD);
    };


    PCW.GetDashBoardData = function () {
        var no_of_msg, no_of_instances, memory_threshold, cpu_threshold, temp_dash;
        no_of_msg = 10;
        no_of_instances = PCW.instance_list.length;
        console.log("--> In timeout 3 "+no_of_instances);
        cpu_threshold = 7;
        memory_threshold =12;
        return;
    };

    PCW.LinkTagsToInstances = function () {
        var bar, foo, instance_id, obj, temp, x, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results;
        PCW.instance_with_tags = [];
        PCW.tag_with_instances = [];
        _ref = PCW.match_list;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            x = _ref[_i];
            foo = x.split(",");
            instance_id = foo[0];
            foo.splice(0, 1);
            bar = {
                instance: instance_id,
                tags: foo
            };
            PCW.instance_with_tags.push(bar);
        }
        _ref1 = PCW.tag_list;
        _results = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            foo = _ref1[_j];
            temp = [];
            _ref2 = PCW.instance_with_tags;
            for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
                bar = _ref2[_k];
                if (__indexOf.call(bar.tags, foo) >= 0) {
                    temp.push(bar.instance);
                }
            }
            obj = {
                tag: foo,
                instances: temp
            };
            _results.push(PCW.tag_with_instances.push(obj));
        }
        return _results;
    };


    PCW.PullMetrics = function () {
        var bar, i, message, request, target, temp, _i, _j, _ref, _ref1;

        message = PCW.PrepOptionString();
        if (message === "Total Filter Deselection") {
            return;
        } else if (message === "Total Metric Deselection") {
            return;
        }

        //bar loop
        for (i = _j = 0, _ref1 = PCW.metric_pull_list.length - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
            bar = document.createElement('paper-progress');
            bar.id = "download_bar_" + i;
            bar.min = 0;
            bar.max = PCW.target_pull_list.length - 1;
            bar.value = 0;

            target = document.getElementById('plot_' + i);
            target.appendChild(bar);
        }

        PCW.final_series = [];
        request = new XMLHttpRequest();
        request.open("POST", "/pull_metrics", true);
        message = PCW.user_token + ";" + PCW.time_parameters + ";" + PCW.target_pull_list[0] + ";" + PCW.metric_pull_list[0];
        PCW.target_index = 0;
        PCW.metric_index = 0;
        return PCW.CallAmazon(request, message);
    };

    PCW.CallAmazon = function (request, message) {
        request.onreadystatechange = function () {
            var bar_id;
            if (request.readyState === 4) {
                if (request.status !== 200) {
                    window.alert(" Apologies. Something went wrong...   Reason: "+ request.responseText);
                } else {
                    PCW.ParseResponse(request.responseText);
                    bar_id = 'download_bar_' + PCW.metric_index;
                    document.getElementById(bar_id).value = String(PCW.target_index);
                    if (PCW.target_index < PCW.target_pull_list.length - 1) {
                        PCW.target_index++;
                        request = new XMLHttpRequest();
                        request.open("POST", "/pull_metrics", true);
                        message = PCW.user_token + ";" + PCW.time_parameters + ";" + PCW.target_pull_list[PCW.target_index] + ";" + PCW.metric_pull_list[PCW.metric_index];
                        return PCW.CallAmazon(request, message);
                    } else {
                        PCW.DrawPlot();
                        PCW.final_series = [];
                        if (PCW.metric_index < PCW.metric_pull_list.length - 1) {
                            PCW.target_index = 0;
                            PCW.metric_index++;
                            request = new XMLHttpRequest();
                            request.open("POST", "/pull_metrics", true);
                            message = PCW.user_token + ";" + PCW.time_parameters + ";" + PCW.target_pull_list[PCW.target_index] + ";" + PCW.metric_pull_list[PCW.metric_index];
                            return PCW.CallAmazon(request, message);
                        }
                    }
                }
            }
        };
        return request.send(message);
    };

    PCW.PrepOptionString = function () {
        var d, end, i, instance, item, message, selector, start, tag, temp, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref, _ref1;
        message = "";

        temp = 3 * 60 * 60 * 1000;

        if (temp < 300000) {
            temp = 300000;
        }
        if (temp > 1209600000) {
            temp = 1209600000;
        }
        d = new Date();
        start = new Date(d.getTime() - temp).toISOString();
        end = new Date(d.getTime()).toISOString();
        message += start + "," + end + ",";
        temp = 5 * 60;

        if (temp < 60) {
            temp = 60;
        }
        if (temp > 604800) {
            temp = 604800;
        }
        message += temp;


        PCW.time_parameters = message;
        message = "";
        PCW.target_pull_list = [];
        console.log("   @@@ In if "+PCW.tag_list);
        for (i = _i = 0, _ref = PCW.instance_list.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
            //i = temp[_i];
            console.log("   @@@ "+PCW.instance_list[i]);
            PCW.target_pull_list.push(PCW.instance_list[i]);
        }
        if (PCW.target_pull_list === null) {
            return "Total Filter Deselection";
        }

        selector = document.getElementById('metricSelector');
        PCW.metric_pull_list = [];



        var metrics_array = ["CPUUtilization","DiskReadOps","DiskWriteOps","DiskReadBytes",
                    "DiskWriteBytes","NetworkIn","NetworkOut"];

        console.log("temp ---> "+metrics_array[1]);
        for (_m = 0, _len4 = metrics_array.length; _m < _len4; _m++) {
           //i = temp[_m];
            i = metrics_array[_m];
            PCW.metric_pull_list.push(i);
        }
        if (PCW.metric_pull_list === null) {
            return "Total Metric Deselection";
        }
        return message;
    };

    PCW.ParseResponse = function (response_string) {
        var bar, d, data, datum, foo, i, instance, label, offset, series, tag, temp, _i, _j, _k, _l, _len, _len1, _m, _n, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
        series = response_string.split(";");
        data = [];
        if (series.length !== 1) {
            for (i = _i = 0, _ref = series.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
                datum = series[i].split(",");
                temp = {
                    Timestamp: datum[0],
                    Value: datum[1]
                };
                data.push(temp);
            }
            for (i = _j = 0, _ref1 = data.length - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
                d = new Date(data[i].Timestamp);
                data[i].Timestamp = d.getTime();
            }
            data.sort(function (a, b) {
                if (a.Timestamp > b.Timestamp) {
                    return 1;
                } else if (a.Timestamp < b.Timestamp) {
                    return -1;
                } else {
                    return 0;
                }
            });
            d = new Date();
            offset = d.getTimezoneOffset() * 60000;
            for (i = _k = 0, _ref2 = data.length - 1; 0 <= _ref2 ? _k <= _ref2 : _k >= _ref2; i = 0 <= _ref2 ? ++_k : --_k) {
                data[i].Timestamp -= offset;
            }
            temp = [];
            for (i = _l = 0, _ref3 = data.length - 1; 0 <= _ref3 ? _l <= _ref3 : _l >= _ref3; i = 0 <= _ref3 ? ++_l : --_l) {
                foo = [];
                foo.push(Number(data[i].Timestamp));
                foo.push(Number(data[i].Value));
                temp.push(foo);
            }
            label = '<b>Instance ID: </b>' + PCW.target_pull_list[PCW.target_index] + '<br>' + '<b>Tags: </b> ';
            _ref4 = PCW.instance_with_tags;
            for (_m = 0, _len = _ref4.length; _m < _len; _m++) {
                instance = _ref4[_m];
                if (instance.instance === PCW.target_pull_list[PCW.target_index]) {
                    _ref5 = instance.tags;
                    for (_n = 0, _len1 = _ref5.length; _n < _len1; _n++) {
                        tag = _ref5[_n];
                        label += tag + '<br>';
                    }
                }
            }
            bar = {
                name: String(label),
                data: temp
            };
            return PCW.final_series.push(bar);
        }
    };

    PCW.DrawPlot = function () {
        var d, e, name, params, temp, time_range, ylabel;
        temp = PCW.time_parameters.split(",");
        time_range = temp[0];
        d = new Date(time_range);
        e = new Date();
        time_range = e.getTime() - d.getTime();


        if ((PCW.metric_pull_list[PCW.metric_index] === "CPUUtilization" ) || (PCW.metric_pull_list[PCW.metric_index] === "MemoryUtilization" )) {
            ylabel = "Percentage";
        } else if (PCW.metric_pull_list[PCW.metric_index] === "DiskReadOps" || PCW.metric_pull_list[PCW.metric_index] === "DiskWriteOps") {
            ylabel = "Count";
        } else {
            ylabel = "Bytes";
        }
        params = {
            credits:{
              enabled: false
            },
            title: {
                text: String(PCW.metric_pull_list[PCW.metric_index]),
                x: -20
            },
            tooltip: {
                headerFormat: '<span style="font-size: 12px"><b>Value: </b> {point.y} <br> <b>Time: </b> {point.key}</span><br>',
                pointFormat: '{series.name}'
            },
            xAxis: {
                title: {
                    text: "Time"
                },
                type: 'datetime',
                minRange: time_range
            },
            yAxis: {
                title: {
                    text: ylabel
                },
                plotLines: [
                    {
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }
                ],
                floor: 0
            },
            legend: {
                enabled: false
            },
            series: PCW.final_series
        };
        name = "#plot_" + PCW.metric_index;
        return $(function () {
            return $(name).highcharts(params);
        });
    };

}).call(this);
