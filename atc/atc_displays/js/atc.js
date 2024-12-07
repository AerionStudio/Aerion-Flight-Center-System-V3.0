document.addEventListener('DOMContentLoaded', function () {
    const apiEndpoint = '../../server/GetATC.php';

    fetch(apiEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.json())
        .then(data => {
            var promises = [];
            let k=0;
            data.forEach(user => {
                var userData = '<tr>';
                userData += '<td>' + (k+1) + '</td>';
                userData += '<td>' + user.user_num + '</td>'; // Assuming user_num is unique and appropriate for display
                userData += '<td>' + user.user_email + '</td>';
                userData += '<td>' + getGradeLabel(user.user_grade) + '</td>';
                var grade = user.user_grade;
                const api = 'https://imp.xfex.cc/server/GetAtcGardeListByATC.php?callsign=' + user.user_num;
                promises.push(
                    fetch(api)
                        .then(response => response.json())
                        .then(atcData => {
                            if (atcData.status === '200') {
                                userData += '<td>' + atcData.data.teacher + '</td>';
                                for (let i = 0; i < atcData.data.list.length; i++) {
                                    userData += atcData.data.list[i];
                                }
                                userData += '<td>' + atcData.data.remark + '</td>';
                            } else {
                                userData += '<td>' + '' + '</td>';
                                userData += getatcgradelist(grade) ;
                                userData += '<td>' + ' ' + '</td>';
                            }
                            userData += '</tr>'; // Move </tr> here
                            return userData;
                        })
                        .catch(error => {
                            console.error('There was a problem with the fetch operation:', error);
                        })

                );
                k++;
            });

            // Wait for all fetch promises to resolve
            Promise.all(promises)
                .then(userRows => {
                    // Append generated HTML to container
                    var container = document.getElementById('atc');
                    container.innerHTML = userRows.join('');
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                });
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

    function getGradeLabel(userGrade) {
        switch (userGrade) {
            case '2':
                return 'STU1';
            case '3':
                return 'STU2';
            case '4':
                return 'STU3';
            case '5':
                return 'CTR1';
            case '6':
                return 'CTR2';
            case '7':
                return 'CTR3';
            case '8':
                return 'INS1';
            case '9':
                return 'INS2';
            case '10':
                return 'INS3';
            case '11':
                return 'SUP';
            case '12':
                return 'ADM';
            default:
                return 'NULL';
        }
    }

    function getatcgradelist(userGrade) {
        switch (userGrade) {
            case '2':
                return '<td><span class="badge text-bg-warning">T</span></td><td><span class="badge text-bg-secondary">X</span></td><td><span class="badge text-bg-secondary">X</span></td><td><span class="badge text-bg-secondary">X</span></td><td><span class="badge text-bg-secondary">X</span></td><td><span class="badge text-bg-secondary">X</span></td>';
            case '3':
                return '<td><span class="badge text-bg-success">√</span></td><td><span class="badge text-bg-secondary">X</span></td><td><span class="badge text-bg-secondary">X</span></td><td><span class="badge text-bg-secondary">X</span></td><td><span class="badge text-bg-secondary">X</span></td><td><span class="badge text-bg-secondary">X</span></td>';
            case '4':
                return '<td><span class="badge text-bg-success">√</span></td><td><span class="badge text-bg-warning">T</span></td><td><span class="badge text-bg-secondary">X</span></td><td><span class="badge text-bg-secondary">X</span></td><td><span class="badge text-bg-secondary">X</span></td><td><span class="badge text-bg-secondary">X</span></td>';
            case '5':
                return '<td><span class="badge text-bg-success">√</span></td><td><span class="badge text-bg-success">√</span></td><td><span class="badge text-bg-success">√</span></td><td><span class="badge text-bg-secondary">X</span></td><td><span class="badge text-bg-secondary">X</span></td><td><span class="badge text-bg-secondary">X</span></td>';
            case '6':
                return '<td><span class="badge text-bg-success">√</span></td><td><span class="badge text-bg-success">√</span></td><td><span class="badge text-bg-success">√</span></td><td><span class="badge text-bg-secondary">X</span></td><td><span class="badge text-bg-secondary">X</span></td><td><span class="badge text-bg-secondary">X</span></td>';
            case '7':
                return '<td><span class="badge text-bg-success">√</span></td><td><span class="badge text-bg-success">√</span></td><td><span class="badge text-bg-success">√</span></td><td><span class="badge text-bg-secondary">X</span></td><td><span class="badge text-bg-secondary">X</span></td><td><span class="badge text-bg-secondary">X</span></td>';
            case '8':
                return '<td><span class="badge text-bg-success">√</span></td><td><span class="badge text-bg-success">√</span></td><td><span class="badge text-bg-success">√</span></td><td><span class="badge text-bg-primary">√</span></td><td><span class="badge text-bg-secondary">X</span></td><td><span class="badge text-bg-secondary">X</span></td>';
            case '9':
                return '<td><span class="badge text-bg-success">√</span></td><td><span class="badge text-bg-success">√</span></td><td><span class="badge text-bg-success">√</span></td><td><span class="badge text-bg-primary">√</span></td><td><span class="badge text-bg-primary">√</span></td><td><span class="badge text-bg-secondary">X</span></td>';
            case '10':
                return '<td><span class="badge text-bg-success">√</span></td><td><span class="badge text-bg-success">√</span></td><td><span class="badge text-bg-success">√</span></td><td><span class="badge text-bg-primary">√</span></td><td><span class="badge text-bg-primary">√</span></td><td><span class="badge text-bg-primary">√</span></td>';
            case '11':
                return '<td><span class="badge text-bg-success">资深</span></td><td><span class="badge text-bg-success">资深</span></td><td><span class="badge text-bg-success">资深</span></td><td><span class="badge text-bg-primary">资深</span></td><td><span class="badge text-bg-primary">资深</span></td><td><span class="badge text-bg-primary">资深</span></td>';
            case '12':
                return '<td><span class="badge text-bg-success">资深</span></td><td><span class="badge text-bg-success">资深</span></td><td><span class="badge text-bg-success">资深</span></td><td><span class="badge text-bg-primary">资深</span></td><td><span class="badge text-bg-primary">资深</span></td><td><span class="badge text-bg-primary">资深</span></td>';
            default:
                return 'NULL';
        }
    }
});
